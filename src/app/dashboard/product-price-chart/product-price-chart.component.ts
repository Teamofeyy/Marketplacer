import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ProductHistoryService } from '../../services/product-history.service';
import { ProductHistory } from '../../interfaces/product-history.interface';
import { TuiAxes, TuiLineChart } from '@taiga-ui/addon-charts';
import { TuiRoot } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-price-chart',
  templateUrl: './product-price-chart.component.html',
  styleUrls: ['./product-price-chart.component.less'],
  standalone: true,
  imports: [
    CommonModule,
    TuiRoot,
    TuiAxes,
    TuiLineChart
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductPriceChartComponent implements OnInit, OnDestroy {
  @Input() productId!: number;

  productHistory: ProductHistory[] = [];
  priceData: [number, number][] = [];
  errorMessage: string = '';
  isLoading: boolean = true;

  // Для хранения меток осей
  xLabels: string[] = [];
  yLabels: string[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private productHistoryService: ProductHistoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Chart Component: Initializing with productId:', this.productId);
    if (!this.productId) {
      console.error('Chart Component: productId is required');
      this.errorMessage = 'ID продукта не указан';
      this.isLoading = false;
      this.cdr.markForCheck();
      return;
    }
    this.loadProductHistory();
  }

  ngOnChanges(): void {
    console.log('Chart Component: Input changed, new productId:', this.productId);
    if (this.productId) {
      this.loadProductHistory();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProductHistory(): void {
    console.log('Chart Component: Loading history for productId:', this.productId);
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.productHistoryService.getProductHistory(this.productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('Chart Component: Received data:', data);
          this.isLoading = false;
          
          try {
            if (!data || data.length === 0) {
              console.log('Chart Component: No data received');
              this.priceData = [];
              this.cdr.markForCheck();
              return;
            }

            // Преобразуем строку в объект Date для поля created_at
            this.productHistory = data.map(item => {
              let date: Date;
              const createdAt = item.created_at as string | Date;
              
              if (typeof createdAt === 'string') {
                date = new Date(createdAt);
                if (isNaN(date.getTime())) {
                  const timestamp = Date.parse(createdAt.replace(' ', 'T'));
                  date = new Date(timestamp);
                }
              } else if (createdAt instanceof Date) {
                date = createdAt;
              } else {
                console.error('Chart Component: Invalid date format:', createdAt);
                date = new Date();
              }
              
              return {
                ...item,
                created_at: date
              };
            });

            console.log('Chart Component: Processed history:', this.productHistory);
            this.prepareChartData();
          } catch (error) {
            console.error('Chart Component: Error processing data:', error);
            this.errorMessage = 'Ошибка обработки данных';
          }
          
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Chart Component: Error loading history:', error);
          this.isLoading = false;
          if (error.status === 401) {
            this.errorMessage = 'Ошибка авторизации. Возможно, токен истек';
          } else if (error.status === 0) {
            this.errorMessage = 'Сервер недоступен. Проверьте подключение к интернету';
          } else if (error.status === 404) {
            this.errorMessage = 'Данные не найдены. Проверьте ID продукта';
          } else {
            this.errorMessage = `Ошибка загрузки данных: ${error.message}`;
          }
          this.cdr.markForCheck();
        }
      });
  }

  private prepareChartData(): void {
    console.log('Chart Component: Preparing chart data');
    if (!this.productHistory || this.productHistory.length === 0) {
      console.log('Chart Component: No history data available');
      this.priceData = [];
      return;
    }

    // Сортируем данные по дате
    const sortedHistory = this.productHistory
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    console.log('Chart Component: Sorted history:', sortedHistory);
    
    // Формируем данные для графика
    this.priceData = sortedHistory.map((item, index) => {
      const point: [number, number] = [index, item.price];
      console.log(`Chart Component: Point ${index}:`, point);
      return point;
    });

    console.log('Chart Component: Final price data:', this.priceData);

    // Вычисляем метки для осей
    this.xLabels = this.priceData.map((_, index) => index.toString());
    this.yLabels = this.calculateYAxisLabels(this.priceData);

    console.log('Chart Component: X Labels:', this.xLabels);
    console.log('Chart Component: Y Labels:', this.yLabels);
  }

  private calculateYAxisLabels(priceData: [number, number][]): string[] {
    if (!priceData || priceData.length === 0) {
      return [];
    }

    const prices = priceData.map(([_, price]) => price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    // Если все цены одинаковые, возвращаем только одно значение
    if (minPrice === maxPrice) {
      return [minPrice.toString()];
    }

    // Вычисляем оптимальный шаг
    const range = maxPrice - minPrice;
    const targetSteps = 5; // Желаемое количество делений
    let step = Math.ceil(range / targetSteps);
    
    // Убеждаемся, что шаг не равен нулю
    step = Math.max(step, 1);

    // Создаем массив меток
    const labels: string[] = [];
    const numSteps = Math.min(Math.floor(range / step) + 1, 10); // Ограничиваем количество меток

    for (let i = 0; i < numSteps; i++) {
      const value = minPrice + (i * step);
      if (value <= maxPrice) {
        labels.push(value.toString());
      }
    }

    // Добавляем максимальное значение, если его еще нет
    if (labels[labels.length - 1] !== maxPrice.toString()) {
      labels.push(maxPrice.toString());
    }

    return labels;
  }
}

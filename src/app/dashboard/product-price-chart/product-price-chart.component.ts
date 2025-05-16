import {Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef, inject} from '@angular/core';
import { ProductHistoryService } from '../../services/product-history.service';
import { ProductHistory } from '../../interfaces/product-history.interface';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import {
  TuiAxes,
  TuiLineChart,
} from '@taiga-ui/addon-charts';
import {TUI_IS_E2E, TuiDay, TuiDayRange, TuiStringHandler} from '@taiga-ui/cdk';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TUI_MONTHS, TuiLoader} from '@taiga-ui/core';

@Component({
  selector: 'app-product-price-chart',
  templateUrl: './product-price-chart.component.html',
  styleUrls: ['./product-price-chart.component.less'],
  standalone: true,
  imports: [
    CommonModule,
    TuiAxes,
    TuiLineChart,
    FormsModule,
    ReactiveFormsModule,
    TuiLoader,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductPriceChartComponent implements OnInit, OnDestroy {
  @Input() productId!: number;

  private readonly isE2E = inject(TUI_IS_E2E);
  private readonly months$ = inject(TUI_MONTHS);

  priceData: [TuiDay, number][] = [];
  errorMessage = '';
  isLoading = true;
  currentMarketplace: { name: string; icon: string } | null = null;

  ratingData: [TuiDay, number][] = [];
  reviewsData: [TuiDay, number][] = [];
  xLabels: string[] = [];
  dateRangeControl = new FormControl<TuiDayRange | null>(null);
  maxRange = 30;
  legendItems = [
    { label: 'Цена', color: 'var(--tui-primary)' },
    { label: 'Рейтинг', color: 'var(--tui-success-fill)' },
    { label: 'Отзывы', color: 'var(--tui-warning-fill)' }
  ];

  get minDate(): TuiDay {
    return this.priceData[0]?.[0] || TuiDay.currentLocal();
  }

  get maxDate(): TuiDay {
    return this.priceData[this.priceData.length - 1]?.[0] || TuiDay.currentLocal();
  }

  get hasData(): boolean {
    return this.priceData.length > 0 ||
      this.ratingData.length > 0 ||
      this.reviewsData.length > 0;
  }

  get value(): readonly (readonly [number, number])[] {
    return [
      ...this.convertToPoints(this.priceData),
      ...this.convertToPoints(this.ratingData),
      ...this.convertToPoints(this.reviewsData)
    ] as const;
  }

  private convertToPoints(data: [TuiDay, number][]): Array<[number, number]> {
    return data.map(([day, value]) => [
      day.toUtcNativeDate().getTime(),
      value
    ] as [number, number]);
  }

  readonly xStringify: TuiStringHandler<number> = (timestamp: number) => {
    return TuiDay.fromUtcNativeDate(new Date(timestamp)).toString();
  };

  readonly yStringify: TuiStringHandler<number> = (value: number) => `${value}`;

  private destroy$ = new Subject<void>();

  constructor(
    private productHistoryService: ProductHistoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProductHistory();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProductHistory(): void {
    if (!this.productId) {
      this.errorMessage = 'ID продукта не указан';
      this.isLoading = false;
      this.cdr.markForCheck();
      return;
    }

    this.isLoading = true;
    this.productHistoryService.getProductHistory(this.productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.handleData(data),
        error: () => {
          this.errorMessage = 'Ошибка загрузки данных';
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  private handleData(data: ProductHistory[]): void {
    try {
      if (!data.length) {
        this.errorMessage = 'Нет данных для отображения';
        return;
      }

      const sortedData = data.sort((a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      // Преобразование данных в TuiDay
      this.priceData = sortedData.map(item => [
        TuiDay.fromLocalNativeDate(new Date(item.created_at)),
        item.price
      ]);

      this.ratingData = sortedData.map(item => [
        TuiDay.fromLocalNativeDate(new Date(item.created_at)),
        item.rating
      ]);

      this.reviewsData = sortedData.map(item => [
        TuiDay.fromLocalNativeDate(new Date(item.created_at)),
        item.review_count
      ]);

      this.xLabels = this.generateXLabels(this.priceData.map(([day]) => day));

      // Установка диапазона дат по умолчанию
      if (this.priceData.length > 0) {
        const start = this.minDate;
        const end = this.maxDate;
        this.dateRangeControl.setValue(new TuiDayRange(start, end));
      }

      this.currentMarketplace = sortedData[0]?.market || null;

    } catch (error) {
      this.errorMessage = 'Ошибка обработки данных';
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  private generateXLabels(dates: TuiDay[]): string[] {
    return dates.map(date =>
      date.toLocalNativeDate().toLocaleDateString('ru-RU', {
        month: 'short',
        day: 'numeric'
      })
    );
  }

  getFormattedDate(day: TuiDay): string {
    return day.toLocalNativeDate().toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

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
  @Input() productId: number = 4;

  productHistory: ProductHistory[] = [];
  priceData: [number, number][] = [];

  // Для хранения меток осей
  xLabels: string[] = [];
  yLabels: string[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private productHistoryService: ProductHistoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('ProductPriceChartComponent initialized with productId:', this.productId);
    this.loadProductHistory();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProductHistory(): void {
    if (!this.productId) {
      console.error('No productId provided');
      this.cdr.markForCheck();
      return;
    }

    this.cdr.markForCheck();
    console.log('Loading product history for productId:', this.productId);

    this.productHistoryService.getProductHistory(this.productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('Received product history data:', data);
          // Преобразуем строку в объект Date для поля created_at
          this.productHistory = data.map(item => ({
            ...item,
            created_at: new Date(item.created_at) // Преобразуем строку в Date
          }));
          this.prepareChartData();
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading product history:', error);
          this.cdr.markForCheck();
        }
      });
  }

  private prepareChartData(): void {
    if (!this.productHistory || this.productHistory.length === 0) {
      console.log('No product history data available');
      this.priceData = [];
      return;
    }

    console.log('Sorting and preparing chart data...');
    this.priceData = this.productHistory
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((item, index) => [index, item.price]);

    console.log('Prepared price data:', this.priceData);

    // Вычисляем метки для осей
    this.xLabels = this.priceData.map((_, index) => index.toString());
    this.yLabels = this.calculateYAxisLabels(this.priceData);

    console.log('X Labels:', this.xLabels);
    console.log('Y Labels:', this.yLabels);
  }

  private calculateYAxisLabels(priceData: [number, number][]): string[] {
    if (!priceData || priceData.length === 0) {
      return [];
    }
    const prices = priceData.map(([_, price]) => price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const step = 500;

    const labels: string[] = [];
    for (let i = minPrice; i <= maxPrice; i += step) {
      labels.push(i.toString());
    }
    return labels;
  }
}

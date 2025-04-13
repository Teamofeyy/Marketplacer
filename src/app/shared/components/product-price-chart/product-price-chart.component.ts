import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MonitoredProductsService } from '../../../services/monitored-products.service';
import { TuiAxes, TuiLineChart } from '@taiga-ui/addon-charts';
import { TuiCalendarRange, tuiCreateDefaultDayRangePeriods } from '@taiga-ui/kit';
import { map, Subject, takeUntil } from 'rxjs';
import {FormControl, FormsModule} from '@angular/forms';
import { ChartDataService } from '../../../services/chart-data-service.service';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';

@Component({
  selector: 'app-product-price-chart',
  standalone: true,
  imports: [TuiCalendarRange, TuiLineChart, TuiAxes, FormsModule],
  templateUrl: './product-price-chart.component.html',
  styleUrls: ['./product-price-chart.component.less']
})
export class ProductPriceChartComponent implements OnInit, OnDestroy {
  @Input() monitoredProductId!: number;
  @Input() token!: string;

  protected items = tuiCreateDefaultDayRangePeriods();
  chartData: readonly (readonly [number, number])[] = [];
  chartLabels: string[] = [];
  rangeControl = new FormControl<TuiDayRange | null>(null);

  private destroy$ = new Subject<void>();

  stringifyX = (index: number): string => this.chartLabels[index] ?? '';
  stringifyY = (value: number): string => `${value} ₽`;

  constructor(
    private monitoredProductsService: MonitoredProductsService,
    private chartDataService: ChartDataService
  ) {
    const today = TuiDay.currentLocal();
    this.rangeControl.setValue(new TuiDayRange(today, today));
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRangeChange(range: TuiDayRange): void {
    this.range = range;
    this.loadData();
  }

  private loadData(): void {
    if (!this.monitoredProductId || !this.range?.from || !this.range?.to) return;

    const startDate = this.convertTuiDayToDate(this.range.from);
    const endDate = this.convertTuiDayToDate(this.range.to);

    endDate.setHours(23, 59, 59, 999);

    const params = {
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      token: this.token
    };

    this.monitoredProductsService
      .getProductHistory(this.monitoredProductId, params)
      .pipe(
        map(history => this.chartDataService.toChartPoints(
          history,
          [startDate, endDate]
        )),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ({ points, labels }) => {
          this.chartData = points;
          this.chartLabels = labels;
        },
        error: (err) => console.error('Ошибка загрузки данных:', err)
      });
  }

  private convertTuiDayToDate(tuiDay: TuiDay): Date {
    return new Date(tuiDay.year, tuiDay.month, tuiDay.day);
  }
}

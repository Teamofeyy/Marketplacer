import { Component, OnInit } from '@angular/core';
import { ProductHistoryService } from '../../services/product-history.service';
import { ProductHistory } from '../../interfaces/product-history.interface';
import { TuiTable, TuiTablePagination } from '@taiga-ui/addon-table';
import { TuiAxes, TuiLineChart, TuiBarChart } from '@taiga-ui/addon-charts';
import { TuiRoot } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-analytics',
  templateUrl: './product-analytics.component.html',
  styleUrls: ['./product-analytics.component.less'],
  standalone: true,
  imports: [
    CommonModule,
    TuiRoot,
    TuiTable,
    TuiTablePagination,
    TuiAxes,
    TuiLineChart,
    TuiBarChart
  ]
})
export class ProductAnalyticsComponent implements OnInit {
  productHistory: ProductHistory[] = [];
  columns = ['name', 'price', 'rating', 'review_count', 'buy_count', 'created_at'];
  
  // Данные для графиков
  priceData: [number, number][] = [];
  reviewData: [number, number][] = [];
  buyCountData: [number, number][] = [];

  constructor(private productHistoryService: ProductHistoryService) {}

  ngOnInit(): void {
    this.loadProductHistory();
  }

  private loadProductHistory(): void {
    this.productHistoryService.getProductHistory(4).subscribe(
      (data) => {
        this.productHistory = data;
        this.prepareChartData();
      }
    );
  }

  private prepareChartData(): void {
    this.priceData = this.productHistory.map((item, index) => [index, item.price]);
    this.reviewData = this.productHistory.map((item, index) => [index, item.review_count]);
    this.buyCountData = this.productHistory.map((item, index) => [index, item.buy_count]);
  }
} 
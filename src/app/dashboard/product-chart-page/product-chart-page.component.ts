import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductPriceChartComponent } from '../product-price-chart/product-price-chart.component';
import { TuiButton } from '@taiga-ui/core';
import { MonitoredProductsService } from '../../services/monitored-products.service';
import { MonitoredProduct } from '../../interfaces/product.interface';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-chart-page',
  standalone: true,
  imports: [
    CommonModule,
    ProductPriceChartComponent,
    TuiButton,
    RouterLink,
    ProductCardComponent
  ],
  templateUrl: './product-chart-page.component.html',
  styleUrls: ['./product-chart-page.component.less']
})
export class ProductChartPageComponent implements OnInit, OnDestroy {
  productId: number | null = null;
  product: MonitoredProduct | null = null;
  similarProducts: MonitoredProduct[] = [];
  isLoading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private productsService: MonitoredProductsService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.productId = +params['id'];
      if (this.productId) {
        this.loadProductData(this.productId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSimilarProductClick(productId: number): void {
    // Перезагружаем данные при клике на похожий товар
    this.loadProductData(productId);
  }

  private loadProductData(id: number): void {
    this.isLoading = true;
    this.error = null;
    this.productId = id;

    // Загружаем список товаров и фильтруем нужный
    this.productsService.getProducts().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (products) => {
        const foundProduct = products.find(p => p.id === id);
        if (foundProduct) {
          this.product = foundProduct;
          // После нахождения основного товара загружаем похожие
          this.productsService.getSimilarProducts(id).subscribe({
            next: (similarProducts) => {
              this.similarProducts = similarProducts;
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Error loading similar products:', err);
              this.similarProducts = [];
              this.isLoading = false;
            }
          });
        } else {
          this.error = 'Товар не найден';
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Ошибка загрузки информации о товаре';
        this.isLoading = false;
      }
    });
  }
}

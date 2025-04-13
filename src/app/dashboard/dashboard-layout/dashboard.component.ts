import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonitoredProductsService } from '../../services/monitored-products.service';
import { MonitoredProduct, MonitoredProductCreate } from '../../interfaces/product.interface';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { ProductPriceChartComponent } from '../product-price-chart/product-price-chart.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    FormsModule,
    ProductCardComponent,
    TuiButton,
    TuiTextfield,
    TuiIcon,
    ProductPriceChartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less',
})
export class DashboardComponent implements OnInit, OnDestroy {
  products: MonitoredProduct[] = [];
  newProductInput = '';
  isChartRoute = false;
  private destroy$ = new Subject<void>();

  constructor(
    private monitoredProductsService: MonitoredProductsService,
    public router: Router,
    public authService: AuthService
  ) {
    // Отслеживаем изменения маршрута
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isChartRoute = this.router.url.includes('/product/') && this.router.url.includes('/chart');
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onProductClick(productId: number) {
    this.router.navigate(['/dashboard/product', productId, 'chart']);
  }

  private isUrl(input: string): boolean {
    try {
      const url = new URL(input);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  addProduct() {
    if (!this.newProductInput) return;

    const isUrl = this.isUrl(this.newProductInput);
    console.log('Input:', this.newProductInput, 'Is URL:', isUrl);

    const productData: MonitoredProductCreate = isUrl
      ? { name: '', url: this.newProductInput }
      : { name: this.newProductInput };

    console.log('Product Data:', productData);

    this.monitoredProductsService.createProduct(productData).subscribe({
      next: (newProduct) => {
        this.products = [...this.products, newProduct];
        this.newProductInput = '';
      },
      error: (error) => {
        console.error('Error creating product:', error);
      }
    });
  }

  private loadProducts() {
    this.monitoredProductsService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }
}

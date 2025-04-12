import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonitoredProductsService } from '../../services/monitored-products.service';
import { MonitoredProduct, MonitoredProductCreate } from '../../interfaces/product.interface';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { AuthService } from '../../services/auth.service';

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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less',
})
export class DashboardComponent implements OnInit {
  products: MonitoredProduct[] = [];
  isHistoryRoute = false;
  newProductInput = '';

  constructor(
    private monitoredProductsService: MonitoredProductsService,
    private router: Router,
    public authService: AuthService
  ) {
    this.isHistoryRoute = this.router.url.includes('/history');
  }

  ngOnInit() {
    this.loadProducts();
  }

  onProductClick(productId: number) {
    this.router.navigate(['/dashboard/product', productId, 'history']);
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

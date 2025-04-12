import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonitoredProductsService } from '../../services/monitored-products.service';
import { MonitoredProduct } from '../../interfaces/product.interface';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import {TuiButton, TuiIcon, TuiTextfield} from '@taiga-ui/core';
import {AuthService} from '../../services/auth.service';

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
  newProductUrl = '';
  newProductName = '';

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

  addProduct() {
    if (!this.newProductName) return;

    const productData = {
      name: this.newProductName,
      ...(this.newProductUrl && { url: this.newProductUrl })
    };

    this.monitoredProductsService.createProduct(productData).subscribe({
      next: (newProduct) => {
        this.products = [...this.products, newProduct];
        this.newProductUrl = '';
        this.newProductName = '';
      },
      error: (error) => {
        console.error('Error creating product:', error);
        // Here you might want to add error handling UI feedback
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

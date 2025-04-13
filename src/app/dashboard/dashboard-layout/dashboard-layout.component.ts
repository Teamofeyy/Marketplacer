import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonitoredProductsService } from '../../services/monitored-products.service';
import { MonitoredProduct } from '../../interfaces/product.interface';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    FormsModule,
    ProductCardComponent
  ],
  template: `
    <div class="dashboard-layout">
      <nav class="dashboard-nav">
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
        <a routerLink="/dashboard/history" routerLinkActive="active">Product History</a>
      </nav>
      <main class="dashboard-content">
        <ng-container *ngIf="!isHistoryRoute">
          <div class="search-bar">
            <input
              type="text"
              [(ngModel)]="newProductName"
              placeholder="Название товара или URL"
              class="name-input"
            >
            <button
              (click)="addProduct()"
              [disabled]="!newProductName"
            >
              Добавить товар
            </button>
          </div>
          <div class="products-grid">
            <app-product-card
              *ngFor="let product of products"
              [product]="product"
              (click)="onProductClick(product.id)"
            ></app-product-card>
          </div>
        </ng-container>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: flex;
      min-height: 100vh;
    }
    .dashboard-nav {
      width: 200px;
      padding: 20px;
      background-color: #f5f5f5;
      border-right: 1px solid #ddd;
    }
    .dashboard-nav a {
      display: block;
      padding: 10px;
      color: #333;
      text-decoration: none;
      margin-bottom: 5px;
      border-radius: 4px;
    }
    .dashboard-nav a:hover {
      background-color: #e9ecef;
    }
    .dashboard-nav a.active {
      background-color: #007bff;
      color: white;
    }
    .dashboard-content {
      flex: 1;
      padding: 20px;
    }
    .search-bar {
      margin-bottom: 20px;
      display: flex;
      gap: 10px;

      input {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 16px;

        &:focus {
          outline: none;
          border-color: #007bff;
        }
      }

      .name-input {
        flex: 1;
      }

      .url-input {
        flex: 2;
      }

      button {
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        white-space: nowrap;

        &:hover:not(:disabled) {
          background-color: #0056b3;
        }

        &:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      }
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
  `]
})
export class DashboardLayoutComponent implements OnInit {
  products: MonitoredProduct[] = [];
  isHistoryRoute = false;
  newProductUrl = '';
  newProductName = '';

  constructor(
    private monitoredProductsService: MonitoredProductsService,
    private router: Router
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

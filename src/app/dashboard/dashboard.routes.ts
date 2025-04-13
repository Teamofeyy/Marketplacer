import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard-layout/dashboard.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'analytics',
        loadComponent: () => import('./product-analytics/product-analytics.component')
          .then(m => m.ProductAnalyticsComponent)
      },
      {
        path: 'product/:id/chart',
        loadComponent: () => import('./product-chart-page/product-chart-page.component')
          .then(m => m.ProductChartPageComponent)
      }
    ]
  }
];

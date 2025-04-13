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
      }
    ]
  }
];

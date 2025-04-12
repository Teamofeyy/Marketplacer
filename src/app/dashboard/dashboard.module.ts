import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard-layout/dashboard.component';
import { DASHBOARD_ROUTES } from './dashboard.routes';
import { TuiAxes, TuiLineChart, TuiBarChart } from '@taiga-ui/addon-charts';
import { TuiLoader } from '@taiga-ui/core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(DASHBOARD_ROUTES),
    DashboardComponent,
    TuiAxes,
    TuiLineChart,
    TuiBarChart,
    TuiLoader
  ]
})
export class DashboardModule { }

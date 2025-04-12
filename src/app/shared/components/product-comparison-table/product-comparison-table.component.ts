import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { MonitoredProduct } from '../../../interfaces/product.interface';

@Component({
  selector: 'app-product-comparison-table',
  standalone: true,
  imports: [CommonModule, TuiTableModule],
  template: `
    <div class="comparison-table">
      <table tuiTable>
        <thead>
          <tr tuiThGroup>
            <th tuiTh>Название товара</th>
            <th tuiTh>Рейтинг</th>
            <th tuiTh>Кол-во отзывов</th>
            <th tuiTh>Кол-во покупок</th>
            <th tuiTh>Цена</th>
          </tr>
        </thead>
        <tbody tuiTbody>
          <tr *ngFor="let product of products" tuiTr>
            <td tuiTd>{{product.name}}</td>
            <td tuiTd>{{product.rating || '-'}}</td>
            <td tuiTd>{{product.review_count || '-'}}</td>
            <td tuiTd>{{product.buy_count || '-'}}</td>
            <td tuiTd>{{product.price || '-'}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .comparison-table {
      margin-top: 2rem;
      background: var(--tui-background-base);
      border-radius: 1rem;
      overflow: hidden;

      table {
        width: 100%;
      }

      th {
        background: var(--tui-background-neutral-1);
        padding: 1rem;
        text-align: left;
      }

      td {
        padding: 1rem;
        border-bottom: 1px solid var(--tui-base-03);
      }

      tr:last-child td {
        border-bottom: none;
      }
    }
  `]
})
export class ProductComparisonTableComponent {
  @Input() products: (MonitoredProduct & { rating?: number; review_count?: number; buy_count?: number; price?: number })[] = [];
} 
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {  TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { MonitoredProduct } from '../../../interfaces/product.interface'
import {DatePipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    TuiCardLarge,
    TuiTitle,
    DatePipe,
    TuiHeader,
    NgIf
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.less'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: MonitoredProduct;
  @Output() cardClick = new EventEmitter<void>();

  viewHistory() {
    this.cardClick.emit();
  }

  openProductUrl() {
    window.open(this.product.url, '_blank');
  }
}

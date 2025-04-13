import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {MonitoredProduct, ProductHistory, ProductHistoryParams, MonitoredProductCreate} from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class MonitoredProductsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = 'http://45.155.207.232:9667';

  getProducts(params: { skip?: number; limit?: number } = {}): Observable<MonitoredProduct[]> {
    const token = this.authService.getToken();
    const defaultParams = {
      skip: 0,
      limit: 100,
      token: token || '',
      ...params
    };

    return this.http.get<MonitoredProduct[]>(`${this.baseUrl}/monitored-products`, {
      params: defaultParams
    });
  }

  createProduct(product: MonitoredProductCreate): Observable<MonitoredProduct> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Authentication token is required');
    }

    return this.http.post<MonitoredProduct>(
      `${this.baseUrl}/monitored-products`,
      product,
      {
        params: { token }
      }
    );
  }

  getProductHistory(
    monitored_product_id: number,
    params: ProductHistoryParams = {}
  ): Observable<ProductHistory[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Authentication token is required');
    }

    // Исправляем формирование query параметров
    const queryParams = {
      token,
      skip: params.skip ?? 0,
      limit: params.limit ?? 100,
      ...(params.start_time && { start_time: params.start_time }),
      ...(params.end_time && { end_time: params.end_time }),
    };

    return this.http.get<ProductHistory[]>(
      `${this.baseUrl}/products/monitored/${monitored_product_id}/history`,
      { params: queryParams }
    );
  }
}

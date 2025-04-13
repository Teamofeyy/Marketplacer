import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductHistory } from '../interfaces/product-history.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductHistoryService {
  private readonly API_URL = 'http://45.155.207.232:9667';
  private readonly token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlX2lkIjoxLCJleHAiOjE3NDQ4OTA4MDd9.ubsO_rkxq6FHBuZy1k0VjVqWE0jChNAHFbeR0AWQFbc';

  constructor(private http: HttpClient) {}

  getProductHistory(productId: number, skip = 0, limit = 100): Observable<ProductHistory[]> {
    return this.http.get<ProductHistory[]>(
      `${this.API_URL}/products/monitored/${productId}/history`,
      {
        params: {
          skip: skip.toString(),
          limit: limit.toString(),
          token: this.token
        }
      }
    );
  }
}

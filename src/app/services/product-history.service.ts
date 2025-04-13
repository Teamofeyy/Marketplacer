import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ProductHistory } from '../interfaces/product-history.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductHistoryService {
  private readonly API_URL = 'http://45.155.207.232:9667';
  private readonly token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlX2lkIjoxLCJleHAiOjE3NDQ4OTA4MDd9.ubsO_rkxq6FHBuZy1k0VjVqWE0jChNAHFbeR0AWQFbc';

  constructor(private http: HttpClient) {}

  getProductHistory(productId: number, skip = 0, limit = 100): Observable<ProductHistory[]> {
    console.log('Making request to:', `${this.API_URL}/products/monitored/${productId}/history`);

    return this.http.get<ProductHistory[]>(
      `${this.API_URL}/products/monitored/${productId}/history`,
      {
        params: {
          skip: skip.toString(),
          limit: limit.toString(),
          token: this.token
        }
      }
    ).pipe(
      tap(response => console.log('API Response:', response)),
      catchError((error: HttpErrorResponse) => {
        console.error('API Error:', error);
        if (error.status === 401) {
          console.error('Authentication failed - token might be expired');
        } else if (error.status === 0) {
          console.error('Network error - server might be down');
        }
        return throwError(() => error);
      })
    );
  }
}

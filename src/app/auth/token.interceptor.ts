import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { catchError, throwError, from, switchMap } from 'rxjs';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();


  // TODO: Удалить выводы перед выкатом в прод
  console.log('Auth Interceptor - Token:', token);
  console.log('Auth Interceptor - Request URL:', req.url);

  const requestWithToken = token
    ? req.clone({
      url: (() => {
        const url = new URL(req.url, window.location.origin);
        url.searchParams.set('token', token);
        const finalUrl = url.toString();
        console.log('Auth Interceptor - Updated URL:', finalUrl);
        return finalUrl;
      })()
    })
    : req;

  const handleAuthError = (error: any) => {
    console.log('Auth Interceptor - Error:', error);
    if (error.status === 401 || error.status === 403) {
      authService.logout();
      return from(router.navigate(['/auth/login'])).pipe(
        switchMap(() => throwError(() => error))
      );
    }
    return throwError(() => error);
  };

  return next(requestWithToken).pipe(
    catchError(handleAuthError)
  );
};

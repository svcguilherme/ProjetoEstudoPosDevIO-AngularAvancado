import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

/**
 * Interceptor HTTP funcional (Angular 15+) para autenticação JWT.
 *
 * Interceptors funcionais substituem a interface HttpInterceptor de classes.
 * São registrados em app.config.ts:
 *   provideHttpClient(withInterceptors([authInterceptor]))
 *
 * Fluxo:
 *   Requisição saindo → interceptor adiciona header Authorization → API recebe
 */
const AUTH_TOKEN_URL = `${environment.apiUrl}/auth/token`;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Rota de autenticação não precisa de headers — ela é quem gera o token
  if (!req.url.startsWith(environment.apiUrl) || req.url === AUTH_TOKEN_URL) {
    return next(req);
  }

  const token = inject(AuthService).token();

  const headers: Record<string, string> = {
    'X-App-Key': environment.appKey,
    'X-App-Secret': environment.appSecret,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return next(req.clone({ setHeaders: headers }));
};

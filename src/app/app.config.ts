import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withNavigationErrorHandler } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { CategoriaConfig } from './categoria-produtos/categoria.config';

import { routes } from './app.routes';

const categoriaConfigDefault: CategoriaConfig = {
  CategoriaId: 0,
  nome: 'Default',
  descricao: 'Categoria padrão',
  status: 'ativo',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withNavigationErrorHandler((err) => {
      const isChunkError = err instanceof Error && err.message.includes('Failed to fetch dynamically imported module');
      if (isChunkError) window.location.reload();
    })),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
    { provide: 'configCategoria', useValue: categoriaConfigDefault },
  ]
};

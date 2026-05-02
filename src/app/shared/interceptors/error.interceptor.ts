import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export interface ApiError {
  status: number;
  mensagem: string;
  original: HttpErrorResponse;
}

/**
 * Interceptor HTTP funcional para tratamento centralizado de erros.
 *
 * Benefícios de centralizar aqui vs. em cada componente:
 *   • Mensagens de erro consistentes em toda a aplicação
 *   • Lógica de redirecionamento (401 → /login) em um só lugar
 *   • Logging e monitoramento centralizados
 *
 * Os componentes recebem um objeto ApiError padronizado em vez de
 * um HttpErrorResponse bruto.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const apiError: ApiError = {
        status: error.status,
        mensagem: traduzirErro(error),
        original: error,
      };

      // Em produção, envie para um serviço de monitoramento (Sentry, etc.)
      console.error('[ErrorInterceptor]', apiError);

      return throwError(() => apiError);
    })
  );
};

function traduzirErro(error: HttpErrorResponse): string {
  switch (error.status) {
    case 0:   return 'Sem conexão com o servidor. Verifique sua internet.';
    case 400: return error.error?.message ?? 'Requisição inválida (400).';
    case 401: return 'Sessão expirada. Faça login novamente (401).';
    case 403: return 'Você não tem permissão para esta ação (403).';
    case 404: return 'Recurso não encontrado (404).';
    case 422: return `Dados inválidos: ${JSON.stringify(error.error?.errors ?? {})}`;
    case 500: return 'Erro interno do servidor. Tente novamente (500).';
    default:  return `Erro ${error.status}: ${error.statusText}`;
  }
}

import { Component, ErrorHandler, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, of } from 'rxjs';
import { RouterLink } from '@angular/router';

/**
 * GlobalErrorHandler — captura erros JavaScript NÃO tratados.
 *
 * Em produção, registre em app.config.ts:
 *   { provide: ErrorHandler, useClass: GlobalErrorHandler }
 *
 * Aqui apenas exibe no console. Em produção, envie para Sentry, Datadog, etc.
 */
// export class GlobalErrorHandler implements ErrorHandler {
//   handleError(error: unknown) {
//     console.error('[GlobalErrorHandler]', error);
//     // monitoringService.log(error);  ← integração com APM
//   }
// }

@Component({
  selector: 'app-error-handling',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './error-handling.component.html',
  styleUrl: './error-handling.component.css',
})
export class ErrorHandlingDemoComponent {
  private readonly http = inject(HttpClient);

  // ── Seção 1: Erros síncronos ──────────────────────────────────────────────
  erroSincrono = signal<string | null>(null);

  lancarErroCapturado() {
    try {
      // Simula uma operação que pode falhar
      const arr: number[] = [];
      const item = arr[0];
      if (item === undefined) throw new Error('Item não encontrado no array!');
    } catch (e) {
      this.erroSincrono.set((e as Error).message);
    }
  }

  lancarErroNaoCapturado() {
    // ⚠️ Este erro vai para o ErrorHandler global (console.error)
    // Em produção seria capturado por GlobalErrorHandler e enviado ao APM
    setTimeout(() => {
      throw new Error('Erro não capturado — observe o console do navegador!');
    }, 0);
    this.erroSincrono.set('Erro lançado! Abra o console (F12) para ver.');
  }

  limparErroSincrono() { this.erroSincrono.set(null); }

  // ── Seção 2: Erros HTTP ───────────────────────────────────────────────────
  carregandoHttp = signal(false);
  erroHttp = signal<string | null>(null);
  dadosHttp = signal<Record<string, unknown> | null>(null);

  simularHttp(tipo: '404' | '401' | 'sem-conexao' | 'sucesso') {
    this.carregandoHttp.set(true);
    this.erroHttp.set(null);
    this.dadosHttp.set(null);

    const urls: Record<string, string> = {
      '404':         'https://jsonplaceholder.typicode.com/posts/999999',
      '401':         'https://httpstat.us/401',
      'sem-conexao': 'http://localhost:9999/inexistente',
      'sucesso':     'https://jsonplaceholder.typicode.com/posts/1',
    };

    this.http.get<Record<string, unknown>>(urls[tipo]).pipe(
      catchError(err => {
        // ← No fluxo real, o ErrorInterceptor já traduz o erro antes de chegar aqui
        const status = (err as { status?: number }).status ?? 0;
        const msgs: Record<number, string> = {
          0:   '❌ Status 0 — Sem resposta do servidor (CORS, rede ou servidor offline)',
          401: '🔐 Status 401 — Não autorizado (token ausente ou expirado)',
          404: '🔍 Status 404 — Recurso não encontrado',
          500: '💥 Status 500 — Erro interno do servidor',
        };
        this.erroHttp.set(msgs[status] ?? `Erro ${status}`);
        return of(null);
      }),
      finalize(() => this.carregandoHttp.set(false))
    ).subscribe(res => { if (res) this.dadosHttp.set(res); });
  }

  // ── Seção 3: Padrão Loading / Error / Empty / Data ────────────────────────
  // Esses 4 estados cobrem qualquer operação assíncrona
  estadoLista = signal<'idle' | 'loading' | 'error' | 'empty' | 'data'>('idle');
  listaItens = signal<string[]>([]);
  erroLista = signal<string | null>(null);

  simularCarregamento(cenario: 'sucesso' | 'erro' | 'vazio') {
    this.estadoLista.set('loading');
    this.erroLista.set(null);
    this.listaItens.set([]);

    setTimeout(() => {
      if (cenario === 'erro')  { this.estadoLista.set('error'); this.erroLista.set('Falha ao carregar. Tente novamente.'); return; }
      if (cenario === 'vazio') { this.estadoLista.set('empty'); return; }
      this.listaItens.set(['Angular', 'TypeScript', 'RxJS', 'Signals', 'Zoneless']);
      this.estadoLista.set('data');
    }, 1200);
  }
}

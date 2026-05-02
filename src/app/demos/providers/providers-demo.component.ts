import { Component, inject, InjectionToken, Injector } from '@angular/core';
import { RouterLink } from '@angular/router';

// ── Serviços de exemplo para o demo ──────────────────────────────────────────

// Interface (contrato)
abstract class Logger {
  abstract log(msg: string): void;
}

// Implementação de desenvolvimento
class DevLogger extends Logger {
  override log(msg: string) { console.log(`%c[DEV] ${msg}`, 'color: #6366f1'); }
}

// Implementação de produção (envia para monitoramento)
class ProdLogger extends Logger {
  override log(msg: string) { console.log(`[PROD] ${msg}`); /* → Sentry */ }
}

// ── useValue: InjectionToken ──────────────────────────────────────────────────
export interface AppConfig { tema: string; versao: string; maxItens: number; }
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

// ── useFactory: valor calculado na criação ────────────────────────────────────
export const DATA_FORMATADA = new InjectionToken<string>('data.formatada');

/**
 * ProvidersDemoComponent — demonstra as 4 estratégias de providers do Angular.
 *
 * Os providers são definidos LOCALMENTE no decorator do componente
 * (sobrescrevem os do root para este componente e seus filhos).
 *
 * Em produção, providers globais ficam em app.config.ts ou no decorator
 * @Injectable({ providedIn: 'root' }).
 */
@Component({
  selector: 'app-providers-demo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './providers-demo.component.html',
  styleUrl: './providers-demo.component.css',

  // ── Aqui ficam os providers locais do componente ─────────────────────────
  providers: [
    // 1. useValue — injeta um valor constante diretamente
    {
      provide: APP_CONFIG,
      useValue: { tema: 'dark', versao: '21.0.0', maxItens: 100 },
    },

    // 2. useClass — escolhe qual implementação usar
    //    Em dev usamos DevLogger, em prod trocamos por ProdLogger sem mudar o código
    {
      provide: Logger,
      useClass: DevLogger,           // ← troque por ProdLogger para prod
    },

    // 3. useFactory — cria o valor com lógica arbitrária
    {
      provide: DATA_FORMATADA,
      useFactory: () => new Date().toLocaleDateString('pt-BR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      }),
    },

    // 4. useExisting — cria um ALIAS para um provider já registrado
    //    OldLogger resolve para a mesma instância de Logger (sem criar nova)
    // { provide: OldLogger, useExisting: Logger },
  ],
})
export class ProvidersDemoComponent {
  private readonly injector = inject(Injector);

  // Injetar usando inject()
  readonly config  = inject(APP_CONFIG);
  readonly logger  = inject(Logger);
  readonly data    = inject(DATA_FORMATADA);

  logMessages: string[] = [];

  usarLogger() {
    const msg = `Logger chamado às ${new Date().toLocaleTimeString()}`;
    this.logger.log(msg);
    this.logMessages = [`✅ ${msg} (veja o console)`, ...this.logMessages].slice(0, 5);
  }
}

import { Pipe, PipeTransform } from '@angular/core';

/**
 * TruncarPipe — trunca texto longo com reticências.
 *
 * PURE (padrão): Angular só recalcula quando os ARGUMENTOS mudam.
 *   ✅ Performance ótima. Use sempre que possível.
 *
 * IMPURE (pure: false): recalcula a cada ciclo de change detection.
 *   ⚠️ Use com cautela — pode impactar performance.
 *   Necessário quando o input é um objeto/array mutado sem nova referência.
 *
 * Uso:
 *   {{ texto | truncar }}           → máx 50 chars (padrão)
 *   {{ texto | truncar:100 }}       → máx 100 chars
 *   {{ texto | truncar:30:'…' }}    → máx 30 chars, sufixo personalizado
 */
@Pipe({ name: 'truncar', standalone: true, pure: true })
export class TruncarPipe implements PipeTransform {
  transform(valor: string | null | undefined, limite = 50, sufixo = '...'): string {
    if (!valor) return '';
    if (valor.length <= limite) return valor;
    return valor.substring(0, limite).trimEnd() + sufixo;
  }
}

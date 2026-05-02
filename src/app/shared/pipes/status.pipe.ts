import { Pipe, PipeTransform } from '@angular/core';

export interface StatusInfo {
  label: string;
  classe: string;  // classe Bootstrap para badge
  icone: string;
}

/**
 * StatusPipe — transforma um status (string) em um objeto com label, CSS e ícone.
 *
 * Pipe puro com OUTPUT rico (objeto) em vez de string simples.
 * Use com @let para evitar chamar o pipe múltiplas vezes no template:
 *
 *   @let info = produto.status | statusInfo;
 *   <span class="badge {{ info.classe }}">{{ info.icone }} {{ info.label }}</span>
 */
@Pipe({ name: 'statusInfo', standalone: true, pure: true })
export class StatusPipe implements PipeTransform {
  private readonly mapa: Record<string, StatusInfo> = {
    ativo:    { label: 'Ativo',    classe: 'bg-success',            icone: '✓' },
    inativo:  { label: 'Inativo',  classe: 'bg-secondary',          icone: '✗' },
    pendente: { label: 'Pendente', classe: 'bg-warning text-dark',  icone: '⏳' },
    rascunho: { label: 'Rascunho', classe: 'bg-light text-dark',    icone: '📝' },
  };

  transform(status: string): StatusInfo {
    return this.mapa[status] ?? { label: status, classe: 'bg-info', icone: '?' };
  }
}

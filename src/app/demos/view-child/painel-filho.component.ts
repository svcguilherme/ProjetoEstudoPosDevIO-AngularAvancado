import { Component, signal } from '@angular/core';

/** Componente filho simples para o demo de ViewChild */
@Component({
  selector: 'app-painel-filho',
  standalone: true,
  template: `
    <div class="painel" [class.highlight]="destacado()">
      <p>Sou o componente filho! Estado: <strong>{{ mensagem() }}</strong></p>
    </div>
  `,
  styles: [`
    .painel { background: #f1f5f9; border: 2px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; transition: all .3s; }
    .painel.highlight { background: #ede9fe; border-color: #6366f1; }
  `],
})
export class PainelFilhoComponent {
  mensagem = signal('pronto');
  destacado = signal(false);

  // Método público acessível via @ViewChild
  destacar() {
    this.destacado.set(true);
    this.mensagem.set('destacado pelo pai! 🎉');
    setTimeout(() => { this.destacado.set(false); this.mensagem.set('pronto'); }, 2000);
  }

  resetar() {
    this.destacado.set(false);
    this.mensagem.set('resetado pelo pai');
  }
}

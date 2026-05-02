import {
  Component, ViewChild, ViewChildren,
  ElementRef, QueryList, AfterViewInit, signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { PainelFilhoComponent } from './painel-filho.component';

/**
 * ViewChild & ViewChildren — acesso a elementos e componentes no template.
 *
 * @ViewChild(selector)
 *   Referencia UM elemento ou componente.
 *   Disponível após ngAfterViewInit().
 *   Pode referenciar: tipo do componente, string de template ref (#var), ou provider token.
 *
 * @ViewChildren(selector)
 *   Referencia MÚLTIPLOS elementos/componentes como QueryList<T>.
 *   QueryList emite (changes) quando itens são adicionados/removidos.
 *
 * signal({ required: true }) — opção para assert que não é null (Angular 17.1+)
 */
@Component({
  selector: 'app-view-child-demo',
  standalone: true,
  imports: [RouterLink, PainelFilhoComponent],
  templateUrl: './view-child-demo.component.html',
  styleUrl: './view-child-demo.component.css',
})
export class ViewChildDemoComponent implements AfterViewInit {

  // ── @ViewChild: tipo do componente ────────────────────────────────────────
  @ViewChild(PainelFilhoComponent)
  painelFilho!: PainelFilhoComponent;

  // ── @ViewChild: referência de template (#inputRef) ────────────────────────
  @ViewChild('inputRef')
  inputEl!: ElementRef<HTMLInputElement>;

  // ── @ViewChildren: lista de componentes ──────────────────────────────────
  @ViewChildren(PainelFilhoComponent)
  todosPaineis!: QueryList<PainelFilhoComponent>;

  viewInitializado = signal(false);
  logEntries = signal<string[]>([]);

  ngAfterViewInit() {
    // ⚠️ Só podemos acessar @ViewChild(ren) APÓS ngAfterViewInit
    this.viewInitializado.set(true);
    this.log('ngAfterViewInit → ViewChild disponível!');
  }

  // ── Ações de demo ─────────────────────────────────────────────────────────

  focarInput() {
    this.inputEl.nativeElement.focus();
    this.log('inputEl.nativeElement.focus() chamado');
  }

  lerInput() {
    const val = this.inputEl.nativeElement.value;
    this.log(`inputEl.nativeElement.value = "${val}"`);
  }

  chamarMetodoFilho() {
    this.painelFilho.destacar(); // chamando método público do filho
    this.log('painelFilho.destacar() chamado pelo pai');
  }

  lerEstadoFilho() {
    const msg = this.painelFilho.mensagem();
    this.log(`painelFilho.mensagem() = "${msg}"`);
  }

  chamarTodos() {
    this.todosPaineis.forEach((p, i) => p.destacar());
    this.log(`todosPaineis.forEach → ${this.todosPaineis.length} componentes chamados`);
  }

  private log(msg: string) {
    const entry = `[${new Date().toLocaleTimeString()}] ${msg}`;
    this.logEntries.update(entries => [entry, ...entries].slice(0, 8));
  }

  // Lista para @for de paineis múltiplos
  readonly itensPaineis = [1, 2, 3];
}

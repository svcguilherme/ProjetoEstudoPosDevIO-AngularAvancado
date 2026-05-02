import { Component, computed, effect, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

// ─────────────────────────────────────────────────────────────────────────────
// Este componente demonstra o Zoneless Change Detection do Angular.
//
// COMO FUNCIONA COM ZONE.JS (modo clássico):
//   O Zone.js "patcha" APIs assíncronas globais (setTimeout, Promise, fetch…).
//   Após cada operação assíncrona, o Angular roda change detection em TODA
//   a árvore de componentes — mesmo os que não mudaram nada.
//
// COMO FUNCIONA SEM ZONE.JS (modo zoneless):
//   O Angular abandona o Zone.js e só atualiza a view quando um Signal
//   notifica uma mudança. A detecção é cirúrgica: só o trecho do template
//   que lê aquele signal é re-renderizado.
// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-zoneless-demo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './zoneless-demo.component.html',
  styleUrl: './zoneless-demo.component.css',
})
export class ZonelessDemoComponent implements OnDestroy {

  // ── 1. signal() ────────────────────────────────────────────────────────────
  // Cria um estado reativo primitivo. Angular rastreia quem lê este signal
  // e re-renderiza apenas esses pontos quando o valor muda.
  contador = signal(0);
  nome = signal('Desenvolvedor');

  // ── 2. computed() ──────────────────────────────────────────────────────────
  // Valor derivado de outros signals. Só recalcula quando algum signal
  // dependente muda (lazy + memoizado).
  mensagem = computed(
    () => `Olá, ${this.nome()}! Você clicou ${this.contador()} vez(es).`
  );
  dobro = computed(() => this.contador() * 2);
  parOuImpar = computed(() => (this.contador() % 2 === 0 ? 'Par' : 'Ímpar'));

  // ── Propriedade comum (SEM signal) ─────────────────────────────────────────
  // Em modo ZONELESS esta propriedade NÃO atualiza a view automaticamente
  // porque o Angular não a rastreia. Em modo clássico (com Zone.js) ela
  // ainda funciona porque o Zone.js dispara CD após cada tick do setInterval.
  contadorSemSignal = 0;

  // ── Log do effect() ────────────────────────────────────────────────────────
  logEntries: string[] = [];

  // ── 3. effect() ────────────────────────────────────────────────────────────
  // Executa um side-effect sempre que qualquer signal lido dentro dele muda.
  // Perfeito para logging, chamadas externas, sincronização, etc.
  constructor() {
    effect(() => {
      const valor = this.contador(); // leitura rastreada
      const entrada = `[${new Date().toLocaleTimeString()}] contador → ${valor}`;
      // Usa um novo array para que o signal de logEntries seja imutável
      this.logEntries = [entrada, ...this.logEntries].slice(0, 6);
    });
  }

  // ── Auto-incremento assíncrono ─────────────────────────────────────────────
  // Demonstra que async (setInterval) só atualiza a view em modo zoneless
  // quando usa signal. A propriedade contadorSemSignal ficará desatualizada
  // na view enquanto o app estiver em modo zoneless.
  private autoIncrementar = false;
  private timerId: ReturnType<typeof setInterval> | null = null;

  toggleAuto() {
    this.autoIncrementar = !this.autoIncrementar;
    if (this.autoIncrementar) {
      this.timerId = setInterval(() => {
        this.contador.update(v => v + 1); // ✅ Signal → view atualiza
        this.contadorSemSignal++;          // ❌ Prop. comum → view NÃO atualiza (zoneless)
      }, 1000);
    } else {
      if (this.timerId) clearInterval(this.timerId);
    }
  }

  get autoAtivo() {
    return this.autoIncrementar;
  }

  // ── Ações manuais ──────────────────────────────────────────────────────────
  incrementar() {
    this.contador.update(v => v + 1); // update: recebe valor atual, retorna novo
  }

  decrementar() {
    this.contador.update(v => Math.max(0, v - 1));
  }

  resetar() {
    this.contador.set(0); // set: substitui o valor diretamente
  }

  ngOnDestroy() {
    if (this.timerId) clearInterval(this.timerId);
  }
}

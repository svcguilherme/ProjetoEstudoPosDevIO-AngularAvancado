import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Produto } from '../../../model/Produto';

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

/**
 * CarrinhoStore — gerenciamento de estado com RxJS.
 *
 * Padrão: BehaviorSubject como "store" (fonte única da verdade).
 *
 *  BehaviorSubject<T>
 *    • Guarda o ÚLTIMO valor emitido (como um signal, mas RxJS)
 *    • Novos assinantes recebem o valor atual imediatamente
 *    • .next(novoValor) → emite e persiste
 *    • .getValue() → leitura síncrona (sem subscribe)
 *
 *  combineLatest([obs1, obs2])
 *    • Emite toda vez que QUALQUER um dos observables emite
 *    • Combina os valores mais recentes de todos
 *    • Útil para derivar estado de múltiplas fontes
 */
@Injectable({ providedIn: 'root' })
export class CarrinhoStore {
  private readonly _itens = new BehaviorSubject<ItemCarrinho[]>([]);

  // Exposição pública como Observable readonly
  readonly itens$ = this._itens.asObservable();

  // Estados derivados com operadores RxJS
  readonly total$ = this.itens$.pipe(
    map(itens => itens.reduce((acc, i) => acc + i.produto.preco * i.quantidade, 0))
  );

  readonly count$ = this.itens$.pipe(
    map(itens => itens.reduce((acc, i) => acc + i.quantidade, 0))
  );

  readonly estaVazio$ = this.itens$.pipe(
    map(itens => itens.length === 0)
  );

  // combineLatest: resume do carrinho com múltiplos observables combinados
  readonly resumo$ = combineLatest([this.itens$, this.total$, this.count$]).pipe(
    map(([itens, total, count]) => ({ itens, total, count }))
  );

  adicionar(produto: Produto) {
    const atual = this._itens.getValue();
    const existente = atual.find(i => i.produto.id === produto.id);

    if (existente) {
      // Imutabilidade: cria novo array e novo objeto de item
      this._itens.next(atual.map(i =>
        i.produto.id === produto.id
          ? { ...i, quantidade: i.quantidade + 1 }
          : i
      ));
    } else {
      this._itens.next([...atual, { produto, quantidade: 1 }]);
    }
  }

  remover(produtoId: number) {
    this._itens.next(this._itens.getValue().filter(i => i.produto.id !== produtoId));
  }

  decrementar(produtoId: number) {
    const atual = this._itens.getValue();
    const item = atual.find(i => i.produto.id === produtoId);
    if (!item) return;

    if (item.quantidade <= 1) {
      this.remover(produtoId);
    } else {
      this._itens.next(atual.map(i =>
        i.produto.id === produtoId ? { ...i, quantidade: i.quantidade - 1 } : i
      ));
    }
  }

  limpar() {
    this._itens.next([]);
  }
}

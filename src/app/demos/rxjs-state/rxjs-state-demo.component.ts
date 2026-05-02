import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { CarrinhoStore } from './carrinho.store';
import { Produto } from '../../../model/Produto';

const CATALOGO: Produto[] = [
  { id: 1, nome: 'Smartphone XYZ', preco: 1999.99, image: 'smartphone.jpg', descricao: '', categoria: 'Eletrônicos', status: 'ativo' },
  { id: 2, nome: 'SmartWatch XYZ', preco: 999.99,  image: 'smartwatch.jpg', descricao: '', categoria: 'Eletrônicos', status: 'ativo' },
  { id: 3, nome: 'PowerBank XYZ',  preco: 199.99,  image: 'powerbank.jpg',  descricao: '', categoria: 'Acessórios',  status: 'ativo' },
  { id: 4, nome: 'Fone Bluetooth', preco: 349.99,  image: 'fone.jpg',       descricao: '', categoria: 'Áudio',       status: 'ativo' },
];

@Component({
  selector: 'app-rxjs-state-demo',
  standalone: true,
  imports: [RouterLink, AsyncPipe, CurrencyPipe],
  templateUrl: './rxjs-state-demo.component.html',
  styleUrl: './rxjs-state-demo.component.css',
})
export class RxjsStateDemoComponent {
  // inject() em vez de construtor — mais conciso no Angular moderno
  readonly store = inject(CarrinhoStore);

  // Observables do store — usados com | async no template
  readonly resumo$ = this.store.resumo$;
  readonly estaVazio$ = this.store.estaVazio$;

  readonly catalogo = CATALOGO;

  adicionar(produto: Produto)      { this.store.adicionar(produto); }
  remover(id: number)              { this.store.remover(id); }
  decrementar(id: number)          { this.store.decrementar(id); }
  limparCarrinho()                 { this.store.limpar(); }
}

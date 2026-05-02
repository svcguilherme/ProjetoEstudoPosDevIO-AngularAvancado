import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoCardDetalheComponent } from "../componentes/produto-card-detalhe.component";
import { ProdutoCountComponent } from "../componentes/produto-count.component";
import { ProdutoApiService } from '../../../services/produto-api.service';
import { Produto } from '../../../../model/Produto';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-produtos-dashboard',
  imports: [CommonModule, ProdutoCardDetalheComponent, ProdutoCountComponent],
  templateUrl: './produtos-dashboard.html',
  styleUrl: './produtos-dashboard.css',
})
export class ProdutosDashboardComponent implements OnInit {

  private readonly produtoService = inject(ProdutoApiService);

  readonly produtos = signal<Produto[]>([]);

  @ViewChild('teste') set content(elemento: ElementRef) {
    if (elemento) {
      fromEvent(elemento.nativeElement, 'click').subscribe(() => {
        alert('Texto clicado!');
      });
    }
  }

  ngOnInit() {
    this.carregarProdutos();
  }

  alterarStatus(produto: Produto) {
    const novoStatus = produto.status === 'ativo' ? 'inativo' : 'ativo';
    this.produtoService.atualizar(produto.id, { status: novoStatus }).subscribe({
      next: () => this.carregarProdutos(),
    });
  }

  private carregarProdutos() {
    this.produtoService.listar().subscribe(lista => this.produtos.set(lista));
  }
}

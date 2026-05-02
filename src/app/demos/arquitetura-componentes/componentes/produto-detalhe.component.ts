import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Produto } from '../../../../model/Produto';
import { TruncarPipe } from '../../../shared/pipes/truncar.pipe';
import { StatusPipe } from '../../../shared/pipes/status.pipe';
import { CurrencyPipe } from '@angular/common';
import { ProdutoApiService } from '../../../services/produto-api.service';

/**
 * ProdutoDetalheComponent — demonstra leitura de parâmetros de rota.
 *
 * Rota configurada em produto.route.ts:
 *   { path: ':id', component: ProdutoDetalheComponent }
 *
 * Acesso via:
 *   (a) snapshot   → leitura única, adequado quando a rota não muda com o componente na tela
 *   (b) paramMap$  → observable, reage quando o id muda sem recriar o componente
 */
@Component({
  selector: 'app-produto-detalhe',
  standalone: true,
  imports: [RouterLink, TruncarPipe, StatusPipe, CurrencyPipe],
  templateUrl: './produto-detalhe.component.html',
  styleUrl: './produto-detalhe.component.css',
})
export class ProdutoDetalheComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ProdutoApiService);

  produto = signal<Produto | null>(null);
  carregando = signal(false);
  erro = signal<string | null>(null);
  idDaRota = signal<string>('');
  metodoUsado = signal<'snapshot' | 'paramMap'>('paramMap');

  ngOnInit() {
    // ── (b) Recomendado: usa observable paramMap — reage a mudanças de ID ──
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.idDaRota.set(String(id));
      this.metodoUsado.set('paramMap');
      this.carregarProduto(id);
    });

    // ── (a) Alternativa: snapshot — leitura única ──────────────────────────
    // const id = Number(this.route.snapshot.paramMap.get('id'));
    // this.carregarProduto(id);
    // this.metodoUsado.set('snapshot');
  }

  private carregarProduto(id: number) {
    this.carregando.set(true);
    this.erro.set(null);
    this.produto.set(null);

    this.apiService.buscarPorId(id).subscribe({
      next: (p) => {
        this.produto.set(p);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set(err?.mensagem ?? 'Erro ao carregar produto.');
        this.carregando.set(false);
      },
    });
  }
}

import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Produto } from '../../../model/Produto';
import { StatusPipe } from '../../shared/pipes/status.pipe';
import { TruncarPipe } from '../../shared/pipes/truncar.pipe';
import { CurrencyPipe } from '@angular/common';

const PRODUTOS: Produto[] = [
  { id: 1, nome: 'Smartphone XYZ',  preco: 1999.99, image: 'smartphone.jpg',  descricao: 'Câmera 108MP, tela AMOLED 120Hz.',      categoria: 'Eletrônicos', status: 'ativo'   },
  { id: 2, nome: 'SmartWatch XYZ',  preco: 999.99,  image: 'smartwatch.jpg',  descricao: 'GPS, monitor cardíaco, 7 dias battery.', categoria: 'Eletrônicos', status: 'ativo'   },
  { id: 3, nome: 'Carregador XYZ',  preco: 99.99,   image: 'carregador.jpg',  descricao: 'Turbo 65W, USB-C, certificação GaN.',    categoria: 'Acessórios',  status: 'inativo' },
  { id: 4, nome: 'PowerBank XYZ',   preco: 199.99,  image: 'powerbank.jpg',   descricao: '20000mAh, PD 45W, display LED.',         categoria: 'Acessórios',  status: 'ativo'   },
  { id: 5, nome: 'Fone Bluetooth',  preco: 349.99,  image: 'fone.jpg',        descricao: 'ANC, 40h autonomia, codec LDAC.',        categoria: 'Áudio',       status: 'ativo'   },
  { id: 6, nome: 'Caixa de Som',    preco: 279.99,  image: 'caixa.jpg',       descricao: 'Bluetooth 5.3, resistente à água IPX7.', categoria: 'Áudio',       status: 'inativo' },
];

/**
 * FiltersDemoComponent — filtragem reativa de listas.
 *
 * ⚠️  Por que NÃO usar um impure pipe para filtrar?
 *   Um impure pipe recalcula a CADA ciclo de change detection.
 *   Em uma lista grande isso pode causar lag perceptível.
 *
 * ✅  Abordagem correta: filtrar no componente com computed() ou RxJS.
 *   computed() recalcula apenas quando um signal dependente muda.
 *   Resultado: zero recálculo desnecessário.
 */
@Component({
  selector: 'app-filters-demo',
  standalone: true,
  imports: [RouterLink, StatusPipe, TruncarPipe, CurrencyPipe],
  templateUrl: './filters-demo.component.html',
  styleUrl: './filters-demo.component.css',
})
export class FiltersDemoComponent {

  // ── Signals de filtro (state) ─────────────────────────────────────────────
  termoBusca = signal('');
  categoriaFiltro = signal('Todas');
  statusFiltro = signal('todos');

  // ── computed: lista derivada dos filtros (recalcula só quando muda) ───────
  readonly produtosFiltrados = computed(() => {
    const termo     = this.termoBusca().toLowerCase();
    const categoria = this.categoriaFiltro();
    const status    = this.statusFiltro();

    return PRODUTOS.filter(p => {
      const matchNome     = p.nome.toLowerCase().includes(termo) ||
                            p.descricao.toLowerCase().includes(termo);
      const matchCategoria = categoria === 'Todas' || p.categoria === categoria;
      const matchStatus    = status === 'todos' || p.status === status;
      return matchNome && matchCategoria && matchStatus;
    });
  });

  readonly totalEncontrados = computed(() => this.produtosFiltrados().length);

  // ── Listas únicas para dropdowns ──────────────────────────────────────────
  readonly categorias = ['Todas', ...new Set(PRODUTOS.map(p => p.categoria))];

  limparFiltros() {
    this.termoBusca.set('');
    this.categoriaFiltro.set('Todas');
    this.statusFiltro.set('todos');
  }
}

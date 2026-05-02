import { TestBed } from '@angular/core/testing';
import { CarrinhoStore, ItemCarrinho } from '../../demos/rxjs-state/carrinho.store';
import { Produto } from '../../model/Produto';

const PROD_A: Produto = { id: 1, nome: 'Produto A', preco: 100, image: '', descricao: '', categoria: 'Cat', status: 'ativo' };
const PROD_B: Produto = { id: 2, nome: 'Produto B', preco: 50,  image: '', descricao: '', categoria: 'Cat', status: 'ativo' };

describe('CarrinhoStore', () => {
  let store: CarrinhoStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(CarrinhoStore);
  });

  it('deve criar o store', () => {
    expect(store).toBeTruthy();
  });

  it('deve iniciar com carrinho vazio', (done) => {
    store.itens$.subscribe(itens => {
      expect(itens.length).toBe(0);
      done();
    });
  });

  it('deve adicionar um produto', (done) => {
    store.adicionar(PROD_A);
    store.itens$.subscribe(itens => {
      expect(itens.length).toBe(1);
      expect(itens[0].produto.id).toBe(PROD_A.id);
      expect(itens[0].quantidade).toBe(1);
      done();
    });
  });

  it('deve incrementar quantidade ao adicionar produto existente', (done) => {
    store.adicionar(PROD_A);
    store.adicionar(PROD_A);
    store.itens$.subscribe(itens => {
      expect(itens.length).toBe(1);
      expect(itens[0].quantidade).toBe(2);
      done();
    });
  });

  it('deve adicionar produtos diferentes como itens separados', (done) => {
    store.adicionar(PROD_A);
    store.adicionar(PROD_B);
    store.itens$.subscribe(itens => {
      expect(itens.length).toBe(2);
      done();
    });
  });

  it('deve remover produto pelo id', (done) => {
    store.adicionar(PROD_A);
    store.adicionar(PROD_B);
    store.remover(PROD_A.id);
    store.itens$.subscribe(itens => {
      expect(itens.length).toBe(1);
      expect(itens[0].produto.id).toBe(PROD_B.id);
      done();
    });
  });

  it('deve calcular o total corretamente', (done) => {
    store.adicionar(PROD_A);  // R$ 100
    store.adicionar(PROD_A);  // R$ 100 x2 = R$ 200
    store.adicionar(PROD_B);  // R$ 50
    store.total$.subscribe(total => {
      expect(total).toBe(250);
      done();
    });
  });

  it('deve calcular o count total de itens', (done) => {
    store.adicionar(PROD_A);
    store.adicionar(PROD_A);
    store.adicionar(PROD_B);
    store.count$.subscribe(count => {
      expect(count).toBe(3);
      done();
    });
  });

  it('deve limpar todos os itens', (done) => {
    store.adicionar(PROD_A);
    store.adicionar(PROD_B);
    store.limpar();
    store.itens$.subscribe(itens => {
      expect(itens.length).toBe(0);
      done();
    });
  });

  it('deve decrementar quantidade do produto', (done) => {
    store.adicionar(PROD_A);
    store.adicionar(PROD_A);
    store.decrementar(PROD_A.id);
    store.itens$.subscribe(itens => {
      expect(itens[0].quantidade).toBe(1);
      done();
    });
  });

  it('deve remover produto ao decrementar com quantidade 1', (done) => {
    store.adicionar(PROD_A);
    store.decrementar(PROD_A.id);
    store.itens$.subscribe(itens => {
      expect(itens.length).toBe(0);
      done();
    });
  });
});

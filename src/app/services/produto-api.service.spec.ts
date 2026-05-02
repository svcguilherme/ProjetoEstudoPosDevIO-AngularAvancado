import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProdutoApiService } from './produto-api.service';
import { Produto } from '../../model/Produto';
import { environment } from '../../environments/environment';

const BASE_URL = `${environment.apiUrl}/produtos`;

const MOCK_PRODUTOS: Produto[] = [
  { id: 1, nome: 'Produto A', preco: 100, image: '', descricao: 'Desc A', categoria: 'Cat', status: 'ativo' },
  { id: 2, nome: 'Produto B', preco: 200, image: '', descricao: 'Desc B', categoria: 'Cat', status: 'inativo' },
];

describe('ProdutoApiService', () => {
  let service: ProdutoApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProdutoApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ProdutoApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify(); // garante que não há requests pendentes
  });

  it('deve criar o serviço', () => {
    expect(service).toBeTruthy();
  });

  describe('listar()', () => {
    it('deve fazer GET para o endpoint correto', () => {
      service.listar().subscribe();
      const req = httpTesting.expectOne(BASE_URL);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_PRODUTOS);
    });

    it('deve retornar lista de produtos', () => {
      let resultado: Produto[] | undefined;
      service.listar().subscribe(p => resultado = p);
      httpTesting.expectOne(BASE_URL).flush(MOCK_PRODUTOS);
      expect(resultado).toEqual(MOCK_PRODUTOS);
      expect(resultado?.length).toBe(2);
    });

    it('deve enviar query params de filtro', () => {
      service.listar({ nome: 'Smartphone', status: 'ativo' }).subscribe();
      const req = httpTesting.expectOne(r => r.url === BASE_URL);
      expect(req.request.params.get('nome')).toBe('Smartphone');
      expect(req.request.params.get('status')).toBe('ativo');
      req.flush([]);
    });
  });

  describe('buscarPorId()', () => {
    it('deve fazer GET com o id correto', () => {
      service.buscarPorId(1).subscribe();
      const req = httpTesting.expectOne(`${BASE_URL}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_PRODUTOS[0]);
    });

    it('deve retornar o produto correto', () => {
      let resultado: Produto | undefined;
      service.buscarPorId(2).subscribe(p => resultado = p);
      httpTesting.expectOne(`${BASE_URL}/2`).flush(MOCK_PRODUTOS[1]);
      expect(resultado?.id).toBe(2);
      expect(resultado?.nome).toBe('Produto B');
    });

    it('deve propagar erro em caso de 404', () => {
      let erroCapturado: any;
      service.buscarPorId(999).subscribe({ error: e => erroCapturado = e });
      httpTesting.expectOne(`${BASE_URL}/999`).flush(
        { message: 'Not Found' },
        { status: 404, statusText: 'Not Found' }
      );
      expect(erroCapturado).toBeTruthy();
    });
  });
});

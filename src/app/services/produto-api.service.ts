import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Produto } from '../../model/Produto';

export interface ProdutoFiltro {
  nome?: string;
  categoria?: string;
  status?: string;
}

/**
 * ProdutoApiService — camada de acesso à API de produtos.
 *
 * Separa a lógica de HTTP do componente (Single Responsibility).
 * O AuthInterceptor injeta automaticamente o header Authorization.
 * O ErrorInterceptor transforma erros HTTP em mensagens amigáveis.
 */
@Injectable({ providedIn: 'root' })
export class ProdutoApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/produtos`;

  listar(filtro?: ProdutoFiltro): Observable<Produto[]> {
    let params = new HttpParams();
    if (filtro?.nome)      params = params.set('nome', filtro.nome);
    if (filtro?.categoria) params = params.set('categoria', filtro.categoria);
    if (filtro?.status)    params = params.set('status', filtro.status);

    return this.http.get<Produto[]>(this.baseUrl, { params }).pipe(
      catchError(err => throwError(() => err))
    );
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/${id}`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  criar(produto: Omit<Produto, 'id'>): Observable<Produto> {
    return this.http.post<Produto>(this.baseUrl, produto).pipe(
      catchError(err => throwError(() => err))
    );
  }

  atualizar(id: number, dados: Partial<Produto>): Observable<Produto> {
    return this.http.put<Produto>(`${this.baseUrl}/${id}`, dados).pipe(
      catchError(err => throwError(() => err))
    );
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(err => throwError(() => err))
    );
  }
}

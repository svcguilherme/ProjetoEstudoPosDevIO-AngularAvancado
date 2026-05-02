import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UsuarioApi } from '../../model/Usuario';

export interface UsuarioCriar {
  nome: string;
  email: string;
  senha: string;
  cpf?: string;
  dataNascimento?: string;
  role?: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  listar(): Observable<UsuarioApi[]> {
    return this.http.get<UsuarioApi[]>(this.baseUrl).pipe(
      catchError(err => throwError(() => err))
    );
  }

  buscarPorId(id: number): Observable<UsuarioApi> {
    return this.http.get<UsuarioApi>(`${this.baseUrl}/${id}`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  criar(usuario: UsuarioCriar): Observable<UsuarioApi> {
    return this.http.post<UsuarioApi>(this.baseUrl, usuario).pipe(
      catchError(err => throwError(() => err))
    );
  }

  atualizar(id: number, dados: Partial<UsuarioCriar>): Observable<UsuarioApi> {
    return this.http.put<UsuarioApi>(`${this.baseUrl}/${id}`, dados).pipe(
      catchError(err => throwError(() => err))
    );
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(err => throwError(() => err))
    );
  }
}

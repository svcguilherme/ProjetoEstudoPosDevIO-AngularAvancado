import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface JwtPayload {
  sub: string;
  nome: string;
  email: string;
  role?: string;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private readonly TOKEN_KEY = 'auth_token';
  private readonly tokenUrl = `${environment.apiUrl}/auth/token`;

  private readonly _token = signal<string | null>(
    isPlatformBrowser(this.platformId) ? localStorage.getItem(this.TOKEN_KEY) : null
  );

  readonly token = this._token.asReadonly();

  readonly isAutenticado = computed(() => {
    const t = this._token();
    if (!t) return false;
    const payload = this.decodificarPayload(t);
    return payload ? payload.exp * 1000 > Date.now() : false;
  });

  readonly usuarioAtual = computed<JwtPayload | null>(() => {
    const t = this._token();
    return t ? this.decodificarPayload(t) : null;
  });

  readonly isAdmin = computed(() => this.usuarioAtual()?.role === 'admin');

  login(email: string, password: string): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(this.tokenUrl, { email, password }).pipe(
      tap(res => this.salvarToken(res.access_token))
    );
  }

  salvarToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
    this._token.set(token);
  }

  removerToken() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this._token.set(null);
  }

  private decodificarPayload(token: string): JwtPayload | null {
    try {
      const partes = token.split('.');
      if (partes.length !== 3) return null;
      const json = atob(partes[1].replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }
}

# Projeto Estudo Angular v21 — DevIO Pós

Projeto de estudo das funcionalidades modernas do Angular 17–21, incluindo Zoneless, Signals, Interceptors, Guards, ViewChild, RxJS e integração com API REST.

---

## Sumário

1. [Estrutura do Projeto](#1-estrutura-do-projeto)
2. [Zoneless Change Detection](#2-zoneless-change-detection)
3. [Environments — Configuração por Ambiente](#3-environments--configuração-por-ambiente)
4. [HttpClient e Proxy de Desenvolvimento](#4-httpclient-e-proxy-de-desenvolvimento)
5. [ProdutoApiService — Camada HTTP](#5-produtoapiservice--camada-http)
6. [AuthService — Autenticação com JWT e Signals](#6-authservice--autenticação-com-jwt-e-signals)
7. [Interceptors HTTP](#7-interceptors-http)
8. [AuthGuard — Proteção de Rotas](#8-authguard--proteção-de-rotas)
9. [LoginComponent](#9-logincomponent)
10. [ProdutosDashboard — toSignal()](#10-produtosdashboard--tosignal)
11. [ViewChild + fromEvent — Acesso ao DOM](#11-viewchild--fromevent--acesso-ao-dom)
12. [Template Syntax — Escapando @ e {{ }}](#12-template-syntax--escapando--e-)
13. [Fluxo Completo de Autenticação](#13-fluxo-completo-de-autenticação)
14. [O que o Backend Node.js precisa implementar](#14-o-que-o-backend-nodejs-precisa-implementar)
15. [Docker — Containerização](#15-docker--containerização)
16. [CI/CD com GitHub Actions](#16-cicd-com-github-actions)

---

## 1. Estrutura do Projeto

```
src/
├── app/
│   ├── auth/
│   │   └── login/
│   │       ├── login.component.ts
│   │       └── login.component.html
│   ├── demos/
│   │   ├── arquitetura-componentes/
│   │   │   └── produtos-dashboard/
│   │   │       ├── produtos-dashboard.ts
│   │   │       └── produtos-dashboard.html
│   │   ├── pipes/
│   │   ├── rxjs-state/
│   │   └── ...
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── produto-api.service.ts
│   ├── shared/
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   └── interceptors/
│   │       ├── auth.interceptor.ts
│   │       └── error.interceptor.ts
│   ├── app.config.ts
│   └── app.routes.ts
└── environments/
    ├── environment.ts        ← desenvolvimento
    └── environment.prod.ts   ← produção
```

---

## 2. Zoneless Change Detection

### O que é?
O Angular usa **Zone.js** por padrão para detectar mudanças: qualquer evento do browser (click, timer, requisição HTTP) dispara verificação em toda a árvore de componentes. O modo **Zoneless** elimina o Zone.js e só atualiza o que realmente mudou, via **Signals**.

### Como foi configurado

```typescript
// app.config.ts
import { provideZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(), // substitui Zone.js
  ]
};
```

### Consequência prática

Com Zoneless, atribuir um valor a uma variável comum **não** dispara re-render. É obrigatório usar:

| Mecanismo | Quando usar |
|---|---|
| `signal()` | Estado local do componente/service |
| `computed()` | Valores derivados de outros signals |
| `toSignal()` | Converter Observable em Signal |
| `async` pipe | Observable diretamente no template |

---

## 3. Environments — Configuração por Ambiente

O Angular não suporta `.env` nativamente (o browser não lê o filesystem). A solução são os arquivos `environment.ts`, trocados automaticamente em build de produção via `fileReplacements` no `angular.json`.

```typescript
// environment.ts (desenvolvimento)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  appKey: 'app-key-1234567890',
  appSecret: 'seu-secret-aqui',
};
```

```typescript
// environment.prod.ts (produção — trocado automaticamente no ng build)
export const environment = {
  production: true,
  apiUrl: 'https://sua-api.com',
  appKey: 'prod-app-key',
  appSecret: 'prod-secret',
};
```

> ⚠️ **Segurança:** qualquer valor em `environment.ts` é compilado no bundle JavaScript e fica visível no browser (DevTools → Sources). Use apenas para chaves **públicas**. Segredos reais devem ficar **somente no backend**, em variáveis de ambiente do servidor.

---

## 4. HttpClient e Proxy de Desenvolvimento

### withFetch()

Habilita a **Fetch API** no `HttpClient` em vez do `XMLHttpRequest`:

```typescript
// app.config.ts
provideHttpClient(withFetch(), withInterceptors([...]))
```

Necessário para compatibilidade com SSR (Server-Side Rendering) e melhor performance.

### Proxy de Desenvolvimento — Evitando CORS

O browser bloqueia requisições de `localhost:4200` para `localhost:3000` (origens diferentes — política CORS). O proxy do `ng serve` resolve isso: a requisição vai para o próprio servidor Angular, que a repassa ao backend sem restrição de CORS.

```json
// proxy.conf.json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": { "^/api": "" },
    "logLevel": "debug"
  }
}
```

```json
// angular.json — registrar o proxy
"serve": {
  "configurations": {
    "development": {
      "proxyConfig": "proxy.conf.json"
    }
  }
}
```

**Fluxo com proxy:**
```
Browser (4200)          Proxy (ng serve)          Backend (3000)
GET /api/produtos  →    remove /api          →    GET /produtos
                        repassa HTTP                    ↓
                                               { dados: [...] }
```

> Em produção não existe proxy. O `apiUrl` aponta direto para o servidor real com URL absoluta.

---

## 5. ProdutoApiService — Camada HTTP

Isola toda a lógica de HTTP do componente (**Single Responsibility Principle**). O componente não sabe *como* os dados chegam, só os consome.

```typescript
@Injectable({ providedIn: 'root' })
export class ProdutoApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/produtos`;

  // GET /produtos?nome=x&categoria=y
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
    return this.http.get<Produto>(`${this.baseUrl}/${id}`);
  }

  criar(produto: Omit<Produto, 'id'>): Observable<Produto> {
    return this.http.post<Produto>(this.baseUrl, produto);
  }

  atualizar(id: number, dados: Partial<Produto>): Observable<Produto> {
    return this.http.put<Produto>(`${this.baseUrl}/${id}`, dados);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
```

**`inject()` vs construtor:**
```typescript
// Forma antiga (ainda válida)
constructor(private http: HttpClient) {}

// Forma moderna (Angular 14+) — mais concisa, funciona fora do construtor
private readonly http = inject(HttpClient);
```

**`Omit<Produto, 'id'>`** — TypeScript utility type que cria um tipo igual a `Produto` mas sem o campo `id` (pois o id é gerado pelo backend ao criar).

---

## 6. AuthService — Autenticação com JWT e Signals

Gerencia o ciclo de vida completo do token JWT: login, persistência, leitura, verificação de expiração e logout.

### Signals para estado reativo

```typescript
// Signal privado — único ponto de escrita (encapsulamento)
private readonly _token = signal<string | null>(
  isPlatformBrowser(this.platformId) ? localStorage.getItem('auth_token') : null
);

// Readonly público — componentes só leem, nunca escrevem diretamente
readonly token = this._token.asReadonly();
```

### computed() — valores derivados automáticos

```typescript
// Recalcula automaticamente sempre que _token() muda
readonly isAutenticado = computed(() => {
  const t = this._token();
  if (!t) return false;
  const payload = this.decodificarPayload(t);
  return payload ? payload.exp * 1000 > Date.now() : false;
  //               ↑ converte unix timestamp para ms e compara com agora
});

readonly usuarioAtual = computed<JwtPayload | null>(() =>
  this._token() ? this.decodificarPayload(this._token()!) : null
);
```

### Login via API

```typescript
login(email: string, password: string): Observable<{ access_token: string }> {
  return this.http.post<{ access_token: string }>(this.tokenUrl, { email, password })
    .pipe(
      tap(res => this.salvarToken(res.access_token))
      // tap: executa efeito colateral (salvar token) sem modificar o valor emitido
    );
}
```

### Proteção contra SSR — PLATFORM_ID

`localStorage` não existe no Node.js. Quando o Angular executa no servidor (SSR/pre-render), instanciar o service causa `ReferenceError: localStorage is not defined`. A solução é verificar o ambiente antes de acessar APIs do browser:

```typescript
private readonly platformId = inject(PLATFORM_ID);
// PLATFORM_ID é uma string: 'browser' ou 'server'

// No campo:
private readonly _token = signal<string | null>(
  isPlatformBrowser(this.platformId)  // true no browser, false no Node.js
    ? localStorage.getItem('auth_token')
    : null                             // no servidor: inicia como null
);

// Nos métodos:
salvarToken(token: string) {
  if (isPlatformBrowser(this.platformId)) {
    localStorage.setItem('auth_token', token); // só executa no browser
  }
  this._token.set(token); // signal funciona em qualquer ambiente
}
```

---

## 7. Interceptors HTTP

Interceptors funcionais (`HttpInterceptorFn`) são funções puras registradas em `app.config.ts`. Executam automaticamente em **toda** requisição/resposta HTTP da aplicação — sem precisar modificar cada chamada individualmente.

### AuthInterceptor — Injeta credenciais automaticamente

```typescript
// auth.interceptor.ts
const AUTH_TOKEN_URL = `${environment.apiUrl}/auth/token`;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Ignora: requisições externas e a própria rota de autenticação
  if (!req.url.startsWith(environment.apiUrl) || req.url === AUTH_TOKEN_URL) {
    return next(req); // passa sem modificar
  }

  const token = inject(AuthService).token();

  const headers: Record<string, string> = {
    'X-App-Key': environment.appKey,       // identifica qual aplicação fez a request
    'X-App-Secret': environment.appSecret, // credencial da aplicação (não do usuário)
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`; // JWT do usuário logado
  }

  return next(req.clone({ setHeaders: headers }));
  //          ↑ req é imutável — clone() cria uma nova requisição com os headers
};
```

**Por que pular a rota `/auth/token`?**
Essa rota *gera* o token. Enviar um `Bearer` inexistente (ou expirado) causaria 401. A própria requisição de login não precisa estar autenticada.

### ErrorInterceptor — Tratamento centralizado de erros

```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const apiError: ApiError = {
        status: error.status,
        mensagem: traduzirErro(error), // transforma código HTTP em mensagem amigável
        original: error,
      };
      console.error('[ErrorInterceptor]', apiError);
      return throwError(() => apiError); // repropaga como ApiError padronizado
    })
  );

function traduzirErro(error: HttpErrorResponse): string {
  switch (error.status) {
    case 0:   return 'Sem conexão com o servidor.';
    case 401: return 'Sessão expirada. Faça login novamente.';
    case 403: return 'Sem permissão para esta ação.';
    case 404: return 'Recurso não encontrado.';
    case 500: return 'Erro interno do servidor.';
    default:  return `Erro ${error.status}: ${error.statusText}`;
  }
}
```

**Registro e ordem dos interceptors:**
```typescript
// app.config.ts
provideHttpClient(
  withFetch(),
  withInterceptors([authInterceptor, errorInterceptor])
)
```

A ordem importa para a **resposta** (executa em ordem inversa):
```
Requisição saindo:  authInterceptor → errorInterceptor → backend
Resposta chegando:  errorInterceptor → authInterceptor → service
```

---

## 8. AuthGuard — Proteção de Rotas

Redireciona para `/login` quando o usuário tenta acessar uma rota protegida sem estar autenticado.

```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAutenticado()) return true;         // token válido → permite acesso

  return router.createUrlTree(['/login']);         // sem token → redireciona
};
```

**Aplicando na rota:**
```typescript
// app.routes.ts
{
  path: 'produtos',
  canActivate: [authGuard],  // ← protege esta rota e todas as filhas
  loadChildren: () => import('./produtos-dashboard/produto.route')
    .then(m => m.ProdutoRoutingModule)
}
```

**`createUrlTree` vs `router.navigate()`:**

| | `createUrlTree` | `router.navigate()` |
|---|---|---|
| Retorno | `UrlTree` (o Angular processa) | `Promise<boolean>` |
| Cancelamento da navegação | Automático e síncrono | Manual |
| Condição de corrida | Não tem | Possível |
| Recomendado em guards | ✅ | ❌ |

---

## 9. LoginComponent

Formulário de login usando `FormsModule` (two-way binding com `ngModel`) e Signals para estado reativo.

```typescript
@Component({ standalone: true, imports: [FormsModule] })
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  erro = signal<string | null>(null);   // null = sem erro exibido
  carregando = signal(false);           // controla disabled do botão e texto

  entrar() {
    if (!this.email || !this.password) {
      this.erro.set('Preencha e-mail e senha.');
      return;
    }
    this.carregando.set(true);
    this.erro.set(null);

    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/produtos']), // sucesso → dashboard
      error: () => {
        this.erro.set('E-mail ou senha inválidos.');
        this.carregando.set(false);
      },
    });
  }
}
```

**No template:**
```html
@if (erro()) {
  <div class="alert-erro">{{ erro() }}</div>
}

<button type="submit" [disabled]="carregando()">
  {{ carregando() ? 'Entrando...' : 'Entrar' }}
</button>
```

**Por que Signals em vez de variáveis simples aqui?**
Com `provideZonelessChangeDetection()`, atribuir `this.erro = 'mensagem'` não atualiza o DOM. `signal.set()` notifica o Angular para re-renderizar somente os bindings que leem aquele signal.

---

## 10. ProdutosDashboard — toSignal()

Substituição de dados hardcoded por chamada real à API, integrada com o modo Zoneless via `toSignal()`.

```typescript
// ANTES — dados estáticos, não funciona para chamada HTTP assíncrona com Zoneless
export class ProdutosDashboardComponent implements OnInit {
  produtos!: Produto[];

  ngOnInit() {
    this.produtos = [ { id: 1, nome: 'Smartphone...' }, ... ]; // hardcoded
  }
}
```

```typescript
// DEPOIS — API real com toSignal()
export class ProdutosDashboardComponent {
  private readonly produtoService = inject(ProdutoApiService);

  // toSignal() assina o Observable e converte em Signal automaticamente
  // initialValue: valor enquanto a requisição não completou (evita null/undefined)
  readonly produtos = toSignal(this.produtoService.listar(), { initialValue: [] });
}
```

**Template (sem mudanças de conceito, só adicionar parênteses):**
```html
<produto-count [produtos]="produtos()"></produto-count>

@for (produto of produtos(); track produto.id) {
  <produto-card-detalhe [produto]="produto" />
}
```

**Comparação das abordagens:**

| Abordagem | Zoneless | Cancela assinatura | Código |
|---|---|---|---|
| `this.produtos = data` (subscribe manual) | ❌ | Manual (`unsubscribe`) | Verboso |
| `async` pipe no template | ✅ | Automático | Médio |
| `toSignal()` | ✅ | Automático | Conciso |

---

## 11. ViewChild + fromEvent — Acesso ao DOM

### O que é `@ViewChild`?

`@ViewChild` permite que o componente obtenha uma **referência direta a um elemento do DOM** (ou a um componente filho) declarado no template. É o mecanismo do Angular para interagir com o DOM de forma controlada — sem usar `document.querySelector`.

### Template reference variable (`#nome`)

No template, marcamos o elemento com `#nomeVariavel`:

```html
<!-- produtos-dashboard.html -->
<h3 #teste>Lista de Produtos</h3>
<!--  ↑ variável de referência de template -->
```

### ViewChild com setter — reagindo ao momento em que o elemento surge

```typescript
// produtos-dashboard.ts
@ViewChild('teste') set content(elemento: ElementRef) {
  if (elemento) {
    // Executado no exato momento em que o elemento entra no DOM
    fromEvent(elemento.nativeElement, 'click').subscribe(() => {
      alert('Texto clicado!');
    });
  }
}
```

**Por que usar o setter em vez de `ngAfterViewInit`?**

| | `ngAfterViewInit` | Setter `@ViewChild` |
|---|---|---|
| Quando executa | Após o primeiro render | Toda vez que o elemento entra/sai do DOM |
| Funciona com `@if` / `*ngIf` | ❌ (elemento pode não existir) | ✅ (detecta quando aparece) |
| Ideal para | Elemento sempre presente | Elemento condicional |

```typescript
// Forma com ngAfterViewInit (elemento sempre presente no DOM)
@ViewChild('teste') elementoRef!: ElementRef;

ngAfterViewInit() {
  fromEvent(this.elementoRef.nativeElement, 'click').subscribe(() => {
    alert('Clicado!');
  });
}
```

### `fromEvent` — Observable de evento do DOM

`fromEvent` do RxJS cria um Observable que emite cada vez que o evento especificado ocorre no elemento:

```typescript
import { fromEvent } from 'rxjs';

fromEvent(elemento.nativeElement, 'click')   // Observable<Event>
  .subscribe(() => alert('clicado!'));

// Outros exemplos:
fromEvent(input.nativeElement, 'input')       // captura digitação
fromEvent(window, 'resize')                   // redimensionamento da janela
fromEvent(document, 'keydown')                // teclas pressionadas
```

**Vantagem sobre `addEventListener`:**  
Como é um Observable, você pode usar todo o poder do RxJS:

```typescript
fromEvent(input.nativeElement, 'input').pipe(
  debounceTime(300),       // espera 300ms após parar de digitar
  map(e => (e.target as HTMLInputElement).value),
  distinctUntilChanged(),  // só emite se o valor mudou
  switchMap(termo => this.service.buscar(termo)) // cancela busca anterior
).subscribe(resultados => this.resultados = resultados);
```

### `ElementRef` — tipagem do elemento nativo

```typescript
import { ElementRef } from '@angular/core';

@ViewChild('teste') elementoRef!: ElementRef<HTMLHeadingElement>;
//                                            ↑ tipo genérico opcional, melhora autocomplete

// Acesso ao elemento nativo do browser:
this.elementoRef.nativeElement.style.color = 'red';
this.elementoRef.nativeElement.focus();
```

> ⚠️ **Cuidado com manipulação direta do DOM:** sempre prefira bindings do Angular (`[style]`, `[class]`, etc.). Use `ElementRef.nativeElement` apenas quando não houver alternativa declarativa (ex: foco, scroll, integração com bibliotecas externas).

### Cuidado com memory leak em Zoneless

Com `fromEvent` dentro de um setter, a assinatura fica ativa mesmo após o componente ser destruído. O correto é cancelar no `ngOnDestroy`:

```typescript
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

private readonly destroy$ = new Subject<void>();

@ViewChild('teste') set content(elemento: ElementRef) {
  if (elemento) {
    fromEvent(elemento.nativeElement, 'click').pipe(
      takeUntil(this.destroy$) // cancela quando destroy$ emitir
    ).subscribe(() => alert('Clicado!'));
  }
}

ngOnDestroy() {
  this.destroy$.next();   // emite → todos os takeUntil cancelam
  this.destroy$.complete();
}
```

---

## 12. Template Syntax — Escapando @ e {{ }}

### Problema

O Angular 17+ processa `@if`, `@for`, `@let`, `@switch` etc. como blocos de control flow, **inclusive dentro de `<pre>` e `<code>`**. Ao criar telas de documentação com exemplos de código, os blocos eram compilados como template real, causando erros de compilação.

### Regra importante: dois processamentos diferentes

O Angular **não** usa o mesmo mecanismo para blocos `@` e interpolações `{{ }}`:

| Sintaxe | Quando é processada | Como escapar |
|---|---|---|
| `@for`, `@if`, `@let`... | No texto **cru** do HTML (antes de decodificar entidades) | `&#64;` (entidade HTML para `@`) |
| `{{ expressão }}` | No texto **decodificado** (depois das entidades HTML) | `{{ '{{' }}` ou `ngNonBindable` |

### Escapando blocos `@`

```html
<!-- ❌ Angular compila como bloco real — NG5002: Incomplete block "for" -->
<pre>@for (item of lista; track item.id) { ... }</pre>

<!-- ✅ &#64; não é reconhecido como @ pelo parser de blocos -->
<pre>&#64;for (item of lista; track item.id) { ... }</pre>
```

### Escapando interpolações `{{ }}`

```html
<!-- ❌ Não funciona: &#123;&#123; é decodificado para {{ e ainda é processado -->
<pre>&#123;&#123; item.nome &#125;&#125;</pre>

<!-- ✅ Usar interpolação Angular para emitir {{ literalmente -->
<pre>{{ '{{' }} item.nome {{ '}}' }}</pre>

<!-- ✅ Melhor ainda: substituir pelo live demo real (exibe o resultado de verdade) -->
@for (item of lista; track item.id) {
  <span>{{ item.nome }}</span>
}
```

---

## 13. Fluxo Completo de Autenticação

```
1. Usuário acessa /produtos
         ↓
2. canActivate: [authGuard]
   → authService.isAutenticado() == false
         ↓
3. Redirecionamento para /login (createUrlTree)
         ↓
4. Usuário preenche:
   email:    admin@admin.com
   password: Admin@123
         ↓
5. entrar() → authService.login(email, password)
         ↓
6. POST http://localhost:3000/auth/token
   body: { "email": "admin@admin.com", "password": "Admin@123" }
   (authInterceptor pula esta URL — sem headers extras)
         ↓
7. Backend valida credenciais →
   resposta: { "access_token": "eyJhbGciOiJIUzI1NiJ9..." }
         ↓
8. tap() → salvarToken()
   → localStorage.setItem('auth_token', token)
   → _token.set(token)
   → isAutenticado() recomputa → true
         ↓
9. router.navigate(['/produtos'])
         ↓
10. canActivate: [authGuard]
    → isAutenticado() == true → permite acesso
         ↓
11. ProdutosDashboardComponent criado
    → toSignal(produtoService.listar())
         ↓
12. GET http://localhost:3000/produtos
    headers automáticos via authInterceptor:
      X-App-Key:     app-key-1234567890
      X-App-Secret:  seu-secret
      Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
         ↓
13. Backend valida token → retorna lista de produtos
         ↓
14. toSignal atualiza → template re-renderiza com os dados
```

---

## 14. O que o Backend Node.js precisa implementar

### Endpoint de autenticação

```
POST /auth/token
Content-Type: application/json

Body:
{
  "email": "admin@admin.com",
  "password": "Admin@123"
}

Resposta 200 OK:
{
  "access_token": "eyJhbGciOiJIUzI1NiJ9..."
}

Resposta 401 Unauthorized:
{
  "message": "Credenciais inválidas"
}
```

### Endpoint de produtos (autenticado)

```
GET /produtos
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
  X-App-Key:     app-key-1234567890
  X-App-Secret:  seu-secret

Resposta 200 OK:
[
  { "id": 1, "nome": "Smartphone XYZ", "preco": 1999.99, "categoria": "Eletrônicos", "status": "ativo" },
  ...
]
```

### Exemplo mínimo com Express + JWT

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' })); // libera o Angular dev server

const SECRET = 'seu-jwt-secret-aqui';

// POST /auth/token
app.post('/auth/token', (req, res) => {
  const { email, password } = req.body;

  if (email !== 'admin@admin.com' || password !== 'Admin@123') {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const access_token = jwt.sign(
    { sub: '1', nome: 'Admin', email },
    SECRET,
    { expiresIn: '1h' }
  );
  res.json({ access_token });
});

// Middleware de autenticação
function autenticar(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).end();
  try {
    req.usuario = jwt.verify(auth.split(' ')[1], SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}

// GET /produtos (protegido)
app.get('/produtos', autenticar, (req, res) => {
  res.json([
    { id: 1, nome: 'Smartphone XYZ', preco: 1999.99, categoria: 'Eletrônicos', status: 'ativo' },
    { id: 2, nome: 'SmartWatch XYZ', preco: 999.99,  categoria: 'Eletrônicos', status: 'ativo' },
  ]);
});

app.listen(3000, () => console.log('API rodando em http://localhost:3000'));
```

**Dependências Node.js:**
```bash
npm install express jsonwebtoken cors
```

---

## Conceitos-chave estudados

| Conceito | Arquivo(s) | O que faz |
|---|---|---|
| `signal()` | `auth.service.ts`, `login.component.ts` | Estado reativo local |
| `computed()` | `auth.service.ts` | Valor derivado que recalcula automaticamente |
| `toSignal()` | `produtos-dashboard.ts` | Converte Observable → Signal |
| `Zoneless` | `app.config.ts` | Change detection sem Zone.js |
| `inject()` funcional | Todos os services e guards | Injeção de dependência moderna |
| `HttpInterceptorFn` | `auth.interceptor.ts`, `error.interceptor.ts` | Intercepta toda requisição/resposta |
| `CanActivateFn` | `auth.guard.ts` | Proteção de rotas funcional |
| `PLATFORM_ID` + `isPlatformBrowser` | `auth.service.ts` | Compatibilidade SSR/browser |
| `environment.ts` | `environments/` | Configuração por ambiente de build |
| `proxy.conf.json` | raiz do projeto | Evita CORS em desenvolvimento |
| `withFetch()` | `app.config.ts` | Fetch API no HttpClient (SSR) |
| `@ViewChild` com setter | `produtos-dashboard.ts` | Referência ao elemento quando entra no DOM |
| `fromEvent()` | `produtos-dashboard.ts` | Observable de evento nativo do browser |
| `ElementRef` | `produtos-dashboard.ts` | Acesso ao elemento nativo do browser |
| `takeUntil` + `Subject` | Padrão RxJS | Cancela assinaturas no destroy (evita memory leak) |
| `@let`, `@for`, `@if` | Templates | Nova sintaxe de control flow |
| Escape de sintaxe em `<pre>` | `pipes-demo.html`, `rxjs-state-demo.html` | `&#64;` para `@`, `{{ '{{' }}` para `{{` |
| Docker multi-stage | `Dockerfile` | Build + imagem de produção mínima |
| Docker Compose | `docker-compose.yml` | Orquestra Angular + API local |
| GitHub Actions | `.github/workflows/ci-cd.yml` | Build automático + push para Docker Hub |

---

## 15. Docker — Containerização

### Por que Docker?

Sem Docker, cada desenvolvedor instala Node, configura versões e depende do ambiente local. Com Docker, o **projeto inteiro roda dentro de um container isolado** — qualquer máquina com Docker instalado executa exatamente o mesmo código.

### Dockerfile — Multi-stage build

O `Dockerfile` usa **dois estágios** para manter a imagem de produção pequena:

```
┌─────────────────────────────────────────────────┐
│  Stage 1: build                                 │
│  Imagem: node:20-alpine (com tudo)              │
│  • npm ci          → instala dependências       │
│  • npm run build   → compila Angular + SSR      │
│  Saída: dist/proj-04/                           │
└──────────────────────────┬──────────────────────┘
                           │  COPY apenas dist/
┌──────────────────────────▼──────────────────────┐
│  Stage 2: production                            │
│  Imagem: node:20-alpine (limpa, sem src)        │
│  • node server/server.mjs  → servidor SSR       │
│  Porta: 4000                                    │
└─────────────────────────────────────────────────┘
```

**Por que dois estágios?**
O estágio `build` contém código-fonte, `devDependencies` e o compilador Angular — tudo desnecessário em produção. O segundo estágio copia apenas o `dist/`, resultando numa imagem muito menor.

```dockerfile
# Stage 1 — compila
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2 — executa (imagem final)
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/dist/proj-04 .
ENV PORT=4000
EXPOSE 4000
CMD ["node", "server/server.mjs"]
```

### .dockerignore

Análogo ao `.gitignore` — evita copiar `node_modules` e `.angular` para dentro do container (reduz contexto de build e tempo):

```
node_modules   ← não entra no container; npm ci recria dentro
dist           ← será gerado dentro do container
.angular       ← cache do CLI, desnecessário
.git           ← histórico git não precisa estar na imagem
```

### Como usar

```bash
# Build da imagem
docker build -t proj-04-angular .

# Rodar o container (http://localhost:4200)
docker run -p 4200:4000 proj-04-angular

# Parar
docker stop <container-id>
```

### Docker Compose

O `docker-compose.yml` orquestra múltiplos serviços com um único comando:

```yaml
services:
  app:                        # Angular SSR
    build: .
    ports:
      - "4200:4000"           # host:container
    environment:
      PORT: "4000"
      NODE_ENV: production
```

```bash
# Subir tudo
docker compose up -d

# Ver logs
docker compose logs -f app

# Parar e remover containers
docker compose down
```

**Por que `-d` (detached)?** Libera o terminal — os containers continuam rodando em background.

O `docker-compose.yml` também inclui um bloco comentado para adicionar a **API Node.js** como segundo serviço, permitindo subir todo o stack com um único `docker compose up`.

---

## 16. CI/CD com GitHub Actions

### O que é CI/CD?

| Sigla | Significa | O que faz |
|---|---|---|
| **CI** | Continuous Integration | Valida o código automaticamente a cada push/PR |
| **CD** | Continuous Delivery/Deployment | Entrega o artefato (imagem Docker) pronto para deploy |

### Arquivo: `.github/workflows/ci-cd.yml`

O workflow tem **dois jobs** em sequência:

```
Push/PR para main
       │
       ▼
┌─────────────┐     falhou → ❌ notifica
│  Job: build │
│  npm ci     │
│  npm build  │
└──────┬──────┘
       │ sucesso + push direto (não PR)
       ▼
┌──────────────────┐
│  Job: docker     │
│  login DockerHub │
│  build + push    │
│  :latest + :sha  │
└──────────────────┘
```

### Por que dois jobs separados?

- **PRs** executam apenas `build` — não fazem push de imagem (branch não mergeada ainda)
- **Push na main** executa `build` + `docker` — garante que só código aprovado vira imagem

### Tags da imagem Docker

```
usuario/proj-04-angular:latest          ← sempre aponta para o build mais recente
usuario/proj-04-angular:abc1234...      ← SHA do commit → permite rollback exato
```

### Cache de build (`cache-from: type=gha`)

O GitHub Actions tem uma camada de cache. As layers do Docker que não mudaram (ex.: `npm ci` quando `package.json` não foi alterado) são reutilizadas → build muito mais rápido.

### Configuração dos Secrets

No GitHub: **Settings → Secrets and variables → Actions**

| Secret | Valor |
|---|---|
| `DOCKERHUB_USERNAME` | Seu usuário no Docker Hub |
| `DOCKERHUB_TOKEN` | Token gerado em hub.docker.com → Account Settings → Security |

Secrets nunca aparecem em logs — o GitHub os mascara automaticamente.

### Fluxo completo de estudo

```
Desenvolve localmente
       │  git push origin main
       ▼
GitHub Actions dispara
       │
       ├─ npm ci + npm run build   ← valida que compila
       │
       └─ docker build + push      ← imagem no Docker Hub
                  │
                  ▼
          Servidor de produção puxa a imagem:
          docker pull usuario/proj-04-angular:latest
          docker compose up -d
```

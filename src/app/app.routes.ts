import { Routes } from '@angular/router';
import { SobrePageComponent } from './pages/sobre-page.component';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import { HomeComponent } from './navegacao/home.component/home.component';
import { ZonelessDemoComponent } from './demos/zoneless/zoneless-demo.component';
import { LoginComponent } from './auth/login/login.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { authGuard } from './shared/guards/auth.guard';
import { adminGuard } from './shared/guards/admin.guard';
import { UsuariosListaComponent } from './usuarios/usuarios-lista/usuarios-lista.component';

export const routes: Routes = [
  // ── Rotas públicas ──────────────────────────────────────────────────────
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'sobre',
    component: SobrePageComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },

  // ── Rotas protegidas (requerem autenticação) ─────────────────────────────
  {
    path: 'usuarios',
    canActivate: [authGuard],
    component: UsuariosListaComponent,
  },
  {
    path: 'cadastro-usuario',
    canActivate: [authGuard, adminGuard],
    component: CadastroUsuarioComponent,
  },
  {
    path: 'cadastro-usuario/:id',
    canActivate: [authGuard, adminGuard],
    component: CadastroUsuarioComponent,
  },
  {
    path: 'produtos',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./demos/arquitetura-componentes/produtos-dashboard/produto.route')
        .then(m => m.ProdutoRoutingModule),
  },
  {
    path: 'zoneless',
    canActivate: [authGuard],
    component: ZonelessDemoComponent,
  },
  {
    path: 'demos',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./demos/demos.routes').then(m => m.DEMO_ROUTES),
  },

  // ── Rota inválida → Not Found ────────────────────────────────────────────
  {
    path: '**',
    component: NotFoundComponent,
  },
];

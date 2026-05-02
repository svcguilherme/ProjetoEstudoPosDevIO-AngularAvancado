import { Routes } from '@angular/router';
import { SobrePageComponent } from './pages/sobre-page.component';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import { HomeComponent } from './navegacao/home.component/home.component';
import { ZonelessDemoComponent } from './demos/zoneless/zoneless-demo.component';

export const routes: Routes = [
	{
		path: '',
		component: HomeComponent
	},
	{
		path: 'cadastro-usuario',
		component: CadastroUsuarioComponent
	},
	{
		path: 'sobre',
		component: SobrePageComponent
	},
	{
		path: 'produtos',
		loadChildren: () => import('./demos/arquitetura-componentes/produtos-dashboard/produto.route').then(m => m.ProdutoRoutingModule)
	},
	{
		path: 'zoneless',
		component: ZonelessDemoComponent
	},
	{
		path: '**',
		redirectTo: ''
	}
];

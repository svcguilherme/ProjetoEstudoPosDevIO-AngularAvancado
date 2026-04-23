import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page.component';
import { SobrePageComponent } from './pages/sobre-page.component';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';

export const routes: Routes = [
	{
		path: '',
		component: HomePageComponent
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
		path: '**',
		redirectTo: ''
	}
];

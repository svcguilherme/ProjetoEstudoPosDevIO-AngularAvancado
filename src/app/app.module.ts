import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { routes } from './app.routes';
import { NavegacaoModule } from './navegacao/navegacao.module';
import { CategoriaProdutoModule } from './categoria-produtos/categoria-produto.module';

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes) , NavegacaoModule, CategoriaProdutoModule.forRoot(
    { CategoriaId: 0, nome: 'Default', descricao: 'Categoria padrão', status: 'ativo' }    
  )],
})
export class AppModule {}
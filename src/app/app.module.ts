import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { routes } from './app.routes';
import { NavegacaoModule } from './navegacao/navegacao.module';

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes) , NavegacaoModule],
})
export class AppModule {}
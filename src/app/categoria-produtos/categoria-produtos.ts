import { Component, Inject } from '@angular/core';
import { CategoriaConfig } from './categoria.config';

@Component({
  selector: 'app-categoria-produtos',
  imports: [],
  templateUrl: './categoria-produtos.html',
  styleUrls: ['./categoria-produtos.css'],
})
export class CategoriaProdutos {
  CategoriaDescricao: string| undefined;
  CategoriaNome: string | undefined;
  CategoriaStatus: 'ativo' | 'inativo' | undefined;

  constructor(@Inject('configCategoria') private ApiConfigCategoria: CategoriaConfig) 
  {

  }

  ngOnInit(): void {
    this.CategoriaDescricao = this.ApiConfigCategoria.descricao;
    this.CategoriaNome = this.ApiConfigCategoria.nome;
    this.CategoriaStatus = this.ApiConfigCategoria.status;
  }

}

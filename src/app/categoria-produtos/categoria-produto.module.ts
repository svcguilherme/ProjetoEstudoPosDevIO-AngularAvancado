import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriaProdutos } from './categoria-produtos';
import { CATEGORIA_PRODUTOS_ROUTES } from './categoria-produtos.routes';
import { CategoriaConfig } from './categoria.config';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CATEGORIA_PRODUTOS_ROUTES),
    CategoriaProdutos,
  ],
})
export class CategoriaProdutoModule {
    static forRoot(configCategoria: CategoriaConfig): ModuleWithProviders<CategoriaProdutoModule> {
        return {
            ngModule: CategoriaProdutoModule,
            providers: [
                { provide: 'configCategoria', useValue: configCategoria }
            ]
        }
    };

    static forChild(): ModuleWithProviders<CategoriaProdutoModule> {
        return {
            ngModule: CategoriaProdutoModule,
            providers: [
                
            ]
        }
    };
}

import { Routes, RouterModule } from "@angular/router";
import { ProdutosDashboardComponent } from "./produtos-dashboard";
import { ProdutoDetalheComponent } from "../componentes/produto-detalhe.component";
import { NgModule } from "@angular/core";

const produtoRouterConfig : Routes = [
    { path: '', component: ProdutosDashboardComponent },
    { path: ':id', component: ProdutoDetalheComponent }
]

@NgModule({
    imports : [
        RouterModule.forChild(produtoRouterConfig)
    ],
    exports : [RouterModule]
})
export class ProdutoRoutingModule {}
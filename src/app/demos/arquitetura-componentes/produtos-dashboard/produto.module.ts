import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProdutoRoutingModule } from "./produto.route";
import { ProdutosDashboardComponent } from "./produtos-dashboard";


@NgModule({
    declarations: [               
    ],
    imports: [
        ProdutosDashboardComponent,
        CommonModule,
        ProdutoRoutingModule
    ],
    exports: [        
    ]
})
export class ProdutoModule {}
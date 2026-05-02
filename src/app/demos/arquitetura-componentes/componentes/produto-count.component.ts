import { Component, Input } from "@angular/core";
import { Produto } from "../../../../model/Produto";
import { CommonModule } from "@angular/common";


@Component({    selector : 'produto-count',
    templateUrl : './produto-count.component.html',
    styleUrls : ['./produto-count.component.css'],
    imports : [CommonModule]
})
export class ProdutoCountComponent {

    @Input()
    produtos!: Produto[];

}
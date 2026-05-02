import { Component, Input,Output, EventEmitter } from "@angular/core";
import { Produto } from "../../../../model/Produto";
import { CommonModule } from "@angular/common";



@Component({    selector : 'produto-card-detalhe',
    templateUrl : './produto-card-detalhe.component.html',
    styleUrl : './produto-card-detalhe.component.css',
    imports : [CommonModule]
})
export class ProdutoCardDetalheComponent {

  @Input()
  produto! : Produto;

  @Output()
  statusChange : EventEmitter<Produto> = new EventEmitter<Produto>();

  emitirEvento(produto : Produto){
    if(produto.status === 'ativo'){
      produto.status = 'inativo';
    }else{
      produto.status = 'ativo';
    }
  }

}
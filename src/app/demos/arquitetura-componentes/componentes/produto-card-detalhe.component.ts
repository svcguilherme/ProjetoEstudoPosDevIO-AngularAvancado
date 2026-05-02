import { Component, Input, Output, EventEmitter, inject } from "@angular/core";
import { Produto } from "../../../../model/Produto";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../services/auth.service";

@Component({
    selector: 'produto-card-detalhe',
    templateUrl: './produto-card-detalhe.component.html',
    styleUrl: './produto-card-detalhe.component.css',
    imports: [CommonModule]
})
export class ProdutoCardDetalheComponent {

  private readonly auth = inject(AuthService);

  @Input()
  produto!: Produto;

  @Output()
  statusChange: EventEmitter<Produto> = new EventEmitter<Produto>();

  readonly isAdmin = this.auth.isAdmin;

  emitirEvento(produto: Produto) {
    this.statusChange.emit(produto);
  }
}

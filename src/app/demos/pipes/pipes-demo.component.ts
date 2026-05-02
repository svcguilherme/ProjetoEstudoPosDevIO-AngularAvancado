import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe, DecimalPipe, PercentPipe,
         UpperCasePipe, LowerCasePipe, TitleCasePipe, SlicePipe, JsonPipe, KeyValuePipe, AsyncPipe } from '@angular/common';
import { TruncarPipe } from '../../shared/pipes/truncar.pipe';
import { StatusPipe } from '../../shared/pipes/status.pipe';
import { Produto } from '../../../model/Produto';

const PRODUTO_EXEMPLO: Produto = {
  id: 1, nome: 'Smartphone Angular XYZ',
  preco: 1999.99, image: 'smartphone.jpg',
  descricao: 'Um smartphone incrível com diversas funcionalidades modernas e bateria de longa duração.',
  categoria: 'Eletrônicos', status: 'ativo',
};

@Component({
  selector: 'app-pipes-demo',
  standalone: true,
  imports: [
    RouterLink, DatePipe, CurrencyPipe, DecimalPipe, PercentPipe,
    UpperCasePipe, LowerCasePipe, TitleCasePipe, SlicePipe, JsonPipe, KeyValuePipe,
    TruncarPipe, StatusPipe,
  ],
  templateUrl: './pipes-demo.component.html',
  styleUrl: './pipes-demo.component.css',
})
export class PipesDemoComponent {
  produto = PRODUTO_EXEMPLO;
  dataAtual = new Date();
  numero = 1234567.89;
  percentual = 0.7543;
  texto = 'o angular é incrível para construir aplicações web modernas';
  statusExemplos = ['ativo', 'inativo', 'pendente', 'rascunho'];
  limiteCustom = signal(30);
  obj = { framework: 'Angular', versao: 21, zoneless: true };
  lista = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];
info: any;
}

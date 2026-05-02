import { Component, OnInit } from '@angular/core';
import { Produto } from '../../../../model/Produto';
import { CommonModule } from '@angular/common';
import { ProdutoCardDetalheComponent } from "../componentes/produto-card-detalhe.component";
import { ProdutoCountComponent } from "../componentes/produto-count.component";

@Component({
  selector: 'app-produtos-dashboard',
  imports: [CommonModule, ProdutoCardDetalheComponent, ProdutoCountComponent],
  templateUrl: './produtos-dashboard.html',
  styleUrl: './produtos-dashboard.css',
})
export class ProdutosDashboardComponent implements OnInit {

  produtos! : Produto[];

  ngOnInit(): void {
    
    this.produtos = [
      {
      id: 1,
      nome: 'Smartphone XYZ',
      preco: 1999.99,
      image: 'smartphone.jpg',
      descricao: 'Um smartphone moderno com recursos avançados.',
      categoria: 'Eletrônicos',
      status: 'ativo'
    },
    {
      id: 2,
      nome: 'SmartWatch XYZ',
      preco: 999.99,
      image: 'smartwatch.jpg',
      descricao: 'Um smartwatch moderno com recursos avançados.',
      categoria: 'Eletrônicos',
      status: 'ativo'
    },
    {
      id: 3,
      nome: 'Carregador XYZ',
      preco: 99.99,
      image: 'carregador.jpg',
      descricao: 'Um carregador moderno com recursos avançados.',
      categoria: 'Eletrônicos',
      status: 'inativo'
    },    
    {
      id: 4,
      nome: 'PowerBank XYZ',
      preco: 199.99,
      image: 'powerbank.jpg',
      descricao: 'Um smartphone moderno com recursos avançados.',
      categoria: 'Eletrônicos',
      status: 'ativo'
    },
    {
      id: 5,
      nome: 'Keyboard XYZ',
      preco: 49.99,
      image: 'keyboard.jpg',
      descricao: 'Um teclado moderno com recursos avançados.',
      categoria: 'Eletrônicos',
      status: 'ativo'
    },
    {
      id: 6,
      nome: 'Mouse XYZ',
      preco: 39.99,
      image: 'mouse.jpg',
      descricao: 'Um mouse moderno com recursos avançados.',
      categoria: 'Eletrônicos',
      status: 'ativo'
    },        
  ];
  }
}

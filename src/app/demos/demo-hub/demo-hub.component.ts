import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface DemoCard {
  titulo: string;
  descricao: string;
  rota: string;
  tag: string;
  tagClass: string;
  icon: string;
}

@Component({
  selector: 'app-demo-hub',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './demo-hub.component.html',
  styleUrl: './demo-hub.component.css',
})
export class DemoHubComponent {
  readonly demos: DemoCard[] = [
    { titulo: 'Tratamento de Erros',      descricao: 'GlobalErrorHandler, interceptors HTTP, estados loading/error/empty.',          rota: '/demos/error-handling', tag: 'Serviços',    tagClass: 'tag-servico',     icon: '🛡️'  },
    { titulo: 'Parâmetros de Rota',        descricao: 'Ler parâmetros da URL com ActivatedRoute e routerParamMap.',                   rota: '/produtos',             tag: 'Roteamento',  tagClass: 'tag-rota',        icon: '🗺️'  },
    { titulo: 'ViewChild & ViewChildren',  descricao: 'Acesse elementos DOM e componentes filhos diretamente no TypeScript.',         rota: '/demos/view-child',     tag: 'Componentes', tagClass: 'tag-componente',  icon: '🔍' },
    { titulo: 'Pipes (nativos + custom)',  descricao: 'Pipes built-in, criação de pipe customizado, pure vs impure.',                 rota: '/demos/pipes',          tag: 'Pipes',       tagClass: 'tag-pipe',        icon: '🔧' },
    { titulo: 'Providers (DI avançada)',   descricao: 'useClass, useValue, useFactory, useExisting — injeção de dependência.',        rota: '/demos/providers',      tag: 'DI',          tagClass: 'tag-di',          icon: '⚙️'  },
    { titulo: 'NgZones',                   descricao: 'runOutsideAngular para operações pesadas, run() para re-entrar na zona.',      rota: '/demos/ngzones',        tag: 'Performance', tagClass: 'tag-performance', icon: '⚡' },
    { titulo: 'Estado com RxJS',           descricao: 'BehaviorSubject store, combineLatest, async pipe — gerenciamento de estado.',  rota: '/demos/rxjs-state',     tag: 'RxJS',        tagClass: 'tag-rxjs',        icon: '🔄' },
    { titulo: 'Filtros na SPA',            descricao: 'Filtragem reativa correta com signals/computed — sem impure pipes.',          rota: '/demos/filters',        tag: 'Padrões',     tagClass: 'tag-padrao',      icon: '🔎' },
    { titulo: 'Zoneless Detection',        descricao: 'Angular sem Zone.js — Signals para change detection cirúrgica.',              rota: '/zoneless',             tag: 'Performance', tagClass: 'tag-performance', icon: '🟢' },
  ];
}

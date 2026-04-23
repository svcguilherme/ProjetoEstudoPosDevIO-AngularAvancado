import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  template: `
    <section class="pagina">
      <h2>Inicio</h2>
      <p>Bem-vindo ao projeto. Use o menu acima para navegar entre as paginas.</p>
    </section>
  `,
  styles: [
    `
      .pagina h2 {
        margin: 0 0 0.5rem;
        color: #0b5d9a;
      }

      .pagina p {
        margin: 0;
        line-height: 1.5;
      }
    `
  ]
})
export class HomePageComponent {}

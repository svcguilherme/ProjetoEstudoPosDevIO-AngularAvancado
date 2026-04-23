import { Component } from '@angular/core';

@Component({
  selector: 'app-sobre-page',
  standalone: true,
  template: `
    <section class="pagina">
      <h2>Sobre</h2>
      <p>Esta pagina demonstra o uso de rotas com menu e renderizacao via router-outlet.</p>
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
export class SobrePageComponent {}

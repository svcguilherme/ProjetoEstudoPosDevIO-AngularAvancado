import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  sair() {
    this.auth.removerToken();
    this.router.navigate(['/login']);
  }
}

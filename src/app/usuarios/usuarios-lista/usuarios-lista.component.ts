import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsuarioApiService } from '../../services/usuario-api.service';
import { UsuarioApi } from '../../../model/Usuario';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-usuarios-lista',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './usuarios-lista.component.html',
  styleUrl: './usuarios-lista.component.css',
})
export class UsuariosListaComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioApiService);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  readonly isAdmin = this.auth.isAdmin;

  usuarios = signal<UsuarioApi[]>([]);
  carregando = signal(true);
  erro = signal<string | null>(null);

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);
    this.usuarioService.listar().subscribe({
      next: lista => {
        this.usuarios.set(lista);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Erro ao carregar usuários.');
        this.carregando.set(false);
      },
    });
  }

  editar(id: number): void {
    this.router.navigate(['/cadastro-usuario', id]);
  }

  deletar(id: number, nome: string): void {
    if (!confirm(`Deseja excluir o usuário "${nome}"?`)) return;

    this.usuarioService.deletar(id).subscribe({
      next: () => this.carregar(),
      error: () => this.erro.set('Erro ao excluir usuário.'),
    });
  }
}

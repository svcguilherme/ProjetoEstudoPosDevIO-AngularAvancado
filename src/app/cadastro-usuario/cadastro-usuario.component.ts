import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CPFValidator } from '../shared/validators/cpf.validator';
import { UsuarioApiService } from '../services/usuario-api.service';

@Component({
  selector: 'app-cadastro-usuario',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css'],
})
export class CadastroUsuarioComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usuarioService = inject(UsuarioApiService);

  cadastroForm!: FormGroup;
  modoEdicao = signal(false);
  usuarioId = signal<number | null>(null);
  carregando = signal(false);
  erro = signal<string | null>(null);
  sucesso = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, this.validacaoNome.bind(this)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.minLength(6), Validators.maxLength(20)]],
      senhaConfirmacao: ['', [Validators.minLength(6), Validators.maxLength(20)]],
      cpf: ['', [Validators.pattern(/^\S+$/), CPFValidator.validar]],
      dataNascimento: ['', this.validaDataNascimento],
      role: ['user', Validators.required],
    }, {
      validators: this.senhasIguaisValidator,
    });

    if (idParam) {
      const id = Number(idParam);
      this.modoEdicao.set(true);
      this.usuarioId.set(id);
      this.carregarUsuario(id);
    } else {
      this.cadastroForm.get('senha')?.addValidators([Validators.required]);
      this.cadastroForm.get('senhaConfirmacao')?.addValidators([Validators.required]);
    }
  }

  private carregarUsuario(id: number): void {
    this.carregando.set(true);
    this.usuarioService.buscarPorId(id).subscribe({
      next: usuario => {
        this.cadastroForm.patchValue({
          nome: usuario.nome,
          email: usuario.email,
          cpf: usuario.cpf ?? '',
          dataNascimento: usuario.dataNascimento ?? '',
          role: usuario.role ?? 'user',
        });
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Erro ao carregar dados do usuário.');
        this.carregando.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    this.carregando.set(true);
    this.erro.set(null);
    this.sucesso.set(null);

    const valores = this.cadastroForm.value;

    if (this.modoEdicao()) {
      const dados: Record<string, unknown> = {
        nome: valores.nome,
        email: valores.email,
        cpf: valores.cpf || undefined,
        dataNascimento: valores.dataNascimento || undefined,
        role: valores.role,
      };
      if (valores.senha) dados['senha'] = valores.senha;

      this.usuarioService.atualizar(this.usuarioId()!, dados).subscribe({
        next: () => this.router.navigate(['/usuarios']),
        error: () => {
          this.erro.set('Erro ao atualizar usuário.');
          this.carregando.set(false);
        },
      });
    } else {
      this.usuarioService.criar({
        nome: valores.nome,
        email: valores.email,
        senha: valores.senha,
        cpf: valores.cpf || undefined,
        dataNascimento: valores.dataNascimento || undefined,
        role: valores.role,
      }).subscribe({
        next: () => this.router.navigate(['/usuarios']),
        error: () => {
          this.erro.set('Erro ao cadastrar usuário.');
          this.carregando.set(false);
        },
      });
    }
  }

  onCpfInput(): void {
    const cpfControl = this.cadastroForm.get('cpf');
    if (!cpfControl) return;

    const apenasNumeros = String(cpfControl.value ?? '').replace(/\D/g, '').slice(0, 11);
    const cpfFormatado = apenasNumeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    cpfControl.setValue(cpfFormatado, { emitEvent: false });
  }

  private validacaoNome(control: AbstractControl): ValidationErrors | null {
    const valor = String(control.value ?? '').trim();
    if (this.cadastroForm?.touched) {
      if (!valor) return { nomeNaoPreenchido: true };
      if (valor.length < 3) return { nomeCurto: true };
    }
    return null;
  }

  private senhasIguaisValidator(control: AbstractControl): ValidationErrors | null {
    const senha = String(control.get('senha')?.value ?? '');
    const senhaConfirmacao = String(control.get('senhaConfirmacao')?.value ?? '');
    if (!senha || !senhaConfirmacao) return null;
    return senha === senhaConfirmacao ? null : { senhasDiferentes: true };
  }

  private validaDataNascimento(control: AbstractControl): ValidationErrors | null {
    const valor = String(control.value ?? '').trim();
    if (!valor) return null;
    const data = new Date(valor);
    const hoje = new Date();
    if (isNaN(data.getTime())) return { dataInvalida: true };
    if (data > hoje) return { dataFutura: true };
    return null;
  }
}

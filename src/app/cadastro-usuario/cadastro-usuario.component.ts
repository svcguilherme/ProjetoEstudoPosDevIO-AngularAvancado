import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Usuario } from '../../model/Usuario';
import { CPFValidator } from '../shared/validators/cpf.validator';

@Component({
  selector: 'app-cadastro-usuario',
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css'],
})
export class CadastroUsuarioComponent implements OnInit {

  cadastroForm!: FormGroup;
  usuario!: Usuario;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, this.validacaoNome.bind(this)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      senhaConfirmacao: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\S+$/), CPFValidator.validar]],
      dataNascimento: ['', this.validaDataNascimento]
    }, {
      validators: this.senhasIguaisValidator
    });
  }


  private validacaoNome(control: AbstractControl): ValidationErrors | null {
    const valor = String(control.value ?? '').trim();

    if (this.cadastroForm?.touched) {
      if (!valor) {
        return { nomeNaoPreenchido: true };
      }

      if (valor.length < 3) {
        return { nomeCurto: true };
      }

      return valor.length >= 3 ? null : { nomeCurto: true };
    }
    return null;
  }

  private senhasIguaisValidator(control: AbstractControl): ValidationErrors | null {
    const senha = String(control.get('senha')?.value ?? '');
    const senhaConfirmacao = String(control.get('senhaConfirmacao')?.value ?? '');

    if (!senha || !senhaConfirmacao) {
      return null;
    }

    return senha === senhaConfirmacao ? null : { senhasDiferentes: true };
  }


  private validaDataNascimento(control: AbstractControl): ValidationErrors | null {
    const valor = String(control.value ?? '').trim();

    if (!valor) {
      return null;
    }

    const data = new Date(valor);
    const hoje = new Date();

    if (isNaN(data.getTime())) {
      return { dataInvalida: true };
    }
  
    if (data > hoje) {
      return { dataFutura: true };
    }
    return null;
  }

  onCpfInput(): void {
    const cpfControl = this.cadastroForm.get('cpf');
    if (!cpfControl) {
      return;
    }

    const apenasNumeros = String(cpfControl.value ?? '').replace(/\D/g, '').slice(0, 11);
    const cpfFormatado = apenasNumeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    cpfControl.setValue(cpfFormatado, { emitEvent: false });
  }
}

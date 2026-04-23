import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CPFValidator {
  static validar(control: AbstractControl): ValidationErrors | null {
    const valor = String(control.value ?? '').trim();

    // Campo vazio fica por conta de Validators.required.
    if (!valor) {
      return null;
    }

    return CPFValidator.isCPFValido(valor) ? null : { cpfInvalido: true };
  }

  private static isCPFValido(cpf: string): boolean {
    // remove tudo que não é número
    cpf = cpf.replace(/\D/g, '');

    // precisa ter 11 dígitos
    if (cpf.length !== 11) return false;

    // elimina CPFs inválidos conhecidos (11111111111, etc)
    if (/^(\d)\1+$/.test(cpf)) return false;

    // valida dígitos verificadores
    let soma = 0;
    let resto;

    // primeiro dígito
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i), 10) * (10 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    if (resto !== parseInt(cpf.charAt(9), 10)) return false;

    // segundo dígito
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i), 10) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    if (resto !== parseInt(cpf.charAt(10), 10)) return false;

    return true;
  }
}
export class Usuario {
  constructor(
    public nome: string,
    public email: string,
    public senha: string,
    public senhaConfirmacao: string,
    public cpf: string,
    public dataNascimento: Date
  ) {}
}

export interface UsuarioApi {
  id: number;
  nome: string;
  email: string;
  cpf?: string;
  dataNascimento?: string;
  role?: string;
}
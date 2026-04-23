export class Usuario
{
    constructor(        
        public nome: string,
        public email: string,
        public senha: string,
        public senhaConfirmacao: string,
        public cpf: string,
        public dataNascimento: Date
    ) {}
}
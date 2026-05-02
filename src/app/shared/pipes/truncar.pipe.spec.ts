import { TruncarPipe } from './truncar.pipe';

describe('TruncarPipe', () => {
  let pipe: TruncarPipe;

  beforeEach(() => {
    pipe = new TruncarPipe();
  });

  it('deve criar o pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('deve retornar string vazia para valor nulo', () => {
    expect(pipe.transform(null as any)).toBe('');
    expect(pipe.transform(undefined as any)).toBe('');
    expect(pipe.transform('')).toBe('');
  });

  it('não deve truncar texto menor ou igual ao limite padrão (50)', () => {
    const texto = 'Texto curto';
    expect(pipe.transform(texto)).toBe('Texto curto');
  });

  it('deve truncar texto maior que o limite padrão e adicionar "..."', () => {
    const texto = 'Este é um texto bastante longo que certamente ultrapassa o limite de cinquenta caracteres.';
    const resultado = pipe.transform(texto);
    expect(resultado.endsWith('...')).toBeTrue();
    expect(resultado.length).toBeLessThanOrEqual(53); // 50 chars + '...'
  });

  it('deve truncar com limite customizado', () => {
    const texto = 'Olá Mundo Angular';
    const resultado = pipe.transform(texto, 8);
    expect(resultado).toBe('Olá Mund...');
  });

  it('deve usar sufixo customizado', () => {
    const texto = 'Texto longo o suficiente para ser truncado neste teste.';
    const resultado = pipe.transform(texto, 10, '…');
    expect(resultado.endsWith('…')).toBeTrue();
  });

  it('deve retornar o próprio texto se tiver exatamente o tamanho do limite', () => {
    const texto = 'A'.repeat(50);
    expect(pipe.transform(texto)).toBe(texto);
  });
});

/**
 * ⚠️  ANGULAR vs .env
 * ─────────────────────────────────────────────────────────────────────────────
 * Node.js usa arquivos .env (com dotenv). Angular NÃO os suporta nativamente
 * porque é compilado para o browser — o browser não lê o filesystem.
 *
 * A solução Angular é este arquivo `environment.ts`, trocado automaticamente
 * pelo `environment.prod.ts` durante o build de produção via `fileReplacements`
 * no angular.json (veja a seção "production > fileReplacements").
 *
 * Para segredos em produção use:
 *   • Variáveis de ambiente no servidor de CI/CD
 *   • Azure App Configuration / AWS Secrets Manager
 *   • Um endpoint de configuração autenticado em runtime
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  appKey: 'app-key-1234567890',
  appSecret: '8m23LJyHWYf1QCZKVcBCkvsisInp5uxvhIQLb4lhGgK',
};

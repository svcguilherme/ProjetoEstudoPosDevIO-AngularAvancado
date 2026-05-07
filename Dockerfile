# ─── Stage 1: Build ──────────────────────────────────────────────────────────
# Instala dependências e compila o projeto Angular (SSR + browser).
FROM node:22.15-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ─── Stage 2: Production ─────────────────────────────────────────────────────
# Imagem mínima com apenas o artefato compilado.
# O bundle gerado pelo @angular/build:application é autocontido (esbuild/Vite
# inline todas as dependências do servidor), então não precisamos de node_modules.
FROM node:22.15-alpine AS production
WORKDIR /app

COPY --from=build /app/dist/proj-04 .

ENV PORT=4000
EXPOSE 4000

CMD ["node", "server/server.mjs"]

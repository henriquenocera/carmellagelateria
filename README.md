# Carmella Gelateria - Status no Ponto

Mini servidor Node para exibir no front-end o status de cada funcionario via API do Ponto Mais.

## Estrutura do projeto

- `server.mjs`: servidor HTTP usado em producao (Render)
- `pontomais-api.mjs`: cliente da API e montagem de headers
- `public/index.html`: pagina com tabela de funcionarios e status
- `index.js`: modo CLI para debug manual da API
- `render.yaml`: configuracao de deploy no Render

## Rodar localmente

1. `npm install`
2. Copie `.env.example` para `.env` e preencha os valores
3. `npm start`
4. Abra `http://localhost:3000`

## Deploy no Render

### Opcao 1 - Blueprint (recomendado)

1. Suba o projeto para um repositorio Git
2. No Render, escolha **New +** -> **Blueprint**
3. Selecione o repositorio (ele vai usar `render.yaml`)
4. Configure as variaveis de ambiente obrigatorias:
   - `PONTOMAIS_ACCESS_TOKEN`, `PONTOMAIS_CLIENT`, `PONTOMAIS_UID`
   - ou `PONTOMAIS_COOKIE`
   - ou `PONTOMAIS_AUTHORIZATION`
5. Deploy

### Opcao 2 - Web Service manual

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Health Check Path**: `/healthz`

## Endpoints

- `/`: pagina HTML
- `/api/statuses`: dados em cache para o front-end
- `/healthz`: healthcheck para Render

## Variaveis de ambiente importantes

- `PONTOMAIS_REFRESH_MS`: intervalo de atualizacao do cache (padrao 120000 = 2min)
- `PORT`: definido automaticamente pelo Render


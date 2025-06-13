# PsiGuard

Plataforma web para gestão de clínicas de psicologia, com agenda integrada, prontuários seguros e funcionalidades auxiliadas por IA. O projeto é baseado em **Next.js** e **Firebase**, utilizando **TypeScript** e **Tailwind CSS** no frontend e **Cloud Functions** no backend. Fluxos de IA são implementados com **Genkit** e Google AI.

## Tecnologias Principais

- **Next.js 15** com React 18 (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Firebase**: Authentication, Firestore, Cloud Functions, Cloud Messaging, Storage e Hosting
- **Genkit** + Google AI para funcionalidades de inteligência artificial
- **Jest** e Testing Library para testes automatizados

## Configuração do Ambiente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Copie o arquivo de exemplo de variáveis de ambiente:
   ```bash
   cp env.example .env.local
   ```
   Preencha `.env.local` com as credenciais do seu projeto Firebase e demais chaves necessárias.
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   O aplicativo ficará disponível em `http://localhost:9002`.

### Comandos úteis

- `npm run dev` &mdash; inicia o servidor Next.js em modo desenvolvimento
- `npm run genkit:dev` &mdash; executa os fluxos de IA em modo de desenvolvimento
- `npm run typecheck` &mdash; verifica os tipos TypeScript
- `npm run lint` &mdash; executa o ESLint
- `npm test` &mdash; roda a suíte de testes com os emuladores Firebase
- `npm run build` &mdash; gera o build de produção

## Variáveis de Ambiente

O projeto utiliza variáveis para configurar serviços do Firebase e integrações externas. Consulte `env.example` para ver todas as chaves disponíveis.

- **Variáveis `NEXT_PUBLIC_*`** são expostas ao navegador e contêm a configuração do Firebase Web SDK e outras chaves públicas.
- **Variáveis sem esse prefixo** (como `FIREBASE_PRIVATE_KEY`) são sigilosas e usadas apenas no backend. Nunca as exponha no cliente.

## Deploy

### Vercel

1. Configure no painel da Vercel todas as variáveis listadas em `env.example`.
2. Cada push na branch principal aciona um deploy automático.

### Firebase

- Para publicar as regras e o hosting:
  ```bash
  firebase deploy --only hosting,firestore
  ```
- Para fazer deploy das Cloud Functions:
  ```bash
  firebase deploy --only functions
  ```

Consulte [docs/blueprint.md](docs/blueprint.md) para uma visão geral das funcionalidades planejadas.

# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at `src/app/page.tsx`.

## Development

### Setup

Install the project dependencies using `npm`:

```bash
npm install
```

### Run the development server

Start the local dev server at `http://localhost:9002`:

```bash
npm run dev
```

### Run the type checker

Validate the TypeScript types:

```bash
npm run typecheck
```

## Environment Variables

This project uses environment variables for configuration, especially for Firebase services.

1.  **Create a local environment file**:
    Copy the example environment file `env.example` to a new file named `.env.local` in the root of your project:
    ```bash
    cp env.example .env.local
    ```
    The `.env.local` file is ignored by Git, so your secret credentials will not be committed.

2.  **Fill in the values in `.env.local`**:
    Open `.env.local` and replace the placeholder values with your actual Firebase project credentials and other necessary API keys.

### Types of Environment Variables:

*   **Client-Side Firebase Configuration (Public)**:
    *   These variables are prefixed with `NEXT_PUBLIC_` (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`).
    *   They are used to initialize the Firebase SDK on the client-side (in the browser).
    *   You can find these values in your Firebase project settings under "General" (Web app configuration).
    *   Also includes `NEXT_PUBLIC_FIREBASE_VAPID_KEY` for Firebase Cloud Messaging (found in Project settings > Cloud Messaging > Web push certificates).
    *   May include other public keys for Google services like `NEXT_PUBLIC_GAS_PRONTUARIO_URL` or Google OAuth credentials if used directly on the client.

*   **Server-Side Firebase Admin SDK Configuration (Secret)**:
    *   These variables are **NOT** prefixed with `NEXT_PUBLIC_` (e.g., `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`).
    *   These are highly sensitive credentials used to initialize the Firebase Admin SDK on the server-side (e.g., in API routes, server components, or Genkit flows running in a Node.js environment).
    *   **CRITICAL**: These variables must be kept secret and should never be exposed to the client-side/browser.
    *   You can generate a new private key (which contains these values) in your Firebase project settings under "Service accounts". When copying the private key, ensure to format it correctly for a single-line environment variable (replace newlines `\n` with `\\n`).
    *   The `src/lib/firebaseAdmin.ts` file uses these variables to interact with Firebase services with admin privileges.

**Important Security Note**: Always ensure that variables containing sensitive information (like `FIREBASE_ADMIN_PRIVATE_KEY`) are *never* prefixed with `NEXT_PUBLIC_` and are only used in server-side code.

For a full blueprint of the application, see [docs/blueprint.md](docs/blueprint.md).

## Deploy e Configuração de Ambiente

### Configurando Variáveis de Ambiente no Vercel

1.  Vá para o dashboard do seu projeto no Vercel.
2.  Navegue até a aba "Settings" (Configurações).
3.  No menu lateral, clique em "Environment Variables" (Variáveis de Ambiente).
4.  Adicione cada variável de ambiente necessária (tanto as `NEXT_PUBLIC_` quanto as de Admin SDK como `FIREBASE_ADMIN_PRIVATE_KEY`, etc.) conforme definido no seu `env.example` ou `.env.local`.
    *   Para a `FIREBASE_ADMIN_PRIVATE_KEY`, que é uma chave multi-linha, você precisará formatá-la para uma única linha no Vercel, substituindo os caracteres de nova linha `\n` literais por `\\n`.
5.  Escolha os ambientes (Produção, Pré-visualização, Desenvolvimento) onde cada variável deve estar disponível. Variáveis de Admin SDK (secretas) geralmente são necessárias em todos os ambientes para que as funções de backend funcionem.

### Comandos de Build

Para construir a aplicação para produção localmente (útil para testar o build antes do deploy):

```bash
npm run build
```

O Vercel geralmente executa este comando automaticamente durante o processo de deploy.

### Deploy

*   **Deploy no Vercel (Frontend e Funções Serverless Next.js):**
    1.  Conecte seu repositório Git (GitHub, GitLab, Bitbucket) ao Vercel.
    2.  Configure o projeto no Vercel, especificando o framework (Next.js) e o diretório raiz.
    3.  O Vercel fará o build e o deploy automaticamente a cada push para a branch configurada (geralmente `main` ou `master`).
    4.  Certifique-se de que todas as variáveis de ambiente necessárias (veja acima) estão configuradas nas configurações do projeto Vercel.

*   **Deploy de Regras do Firestore e Índices (Firebase):**
    Se você fizer alterações em `firestore.rules` ou `firestore.indexes.json`, você precisará fazer o deploy delas para o Firebase:
    ```bash
    firebase deploy --only firestore
    ```
    Isso requer que você tenha o Firebase CLI instalado e configurado, e esteja logado (`firebase login`) e tenha selecionado o projeto correto (`firebase use <your-project-id>`).

*   **Deploy de Cloud Functions (Firebase):**
    Se você tiver Cloud Functions na pasta `functions/`, para fazer o deploy delas:
    ```bash
    firebase deploy --only functions
    ```

### Onde Conferir Logs e Rollback

*   **Vercel:**
    *   **Logs:** No dashboard do seu projeto Vercel, vá para a aba "Logs". Você pode filtrar logs por "Builds", "Serverless Functions", "Edge Functions", etc. Para funções de API Next.js, os logs aparecerão em "Serverless Functions".
    *   **Rollback:** Na aba "Deployments" do seu projeto Vercel, você verá uma lista de todos os deploys. Cada deploy tem um menu de contexto (geralmente três pontos) que permite reverter para uma versão anterior ("Redeploy" ou "Promote to Production" para um deploy mais antigo).

*   **Firebase:**
    *   **Firestore (Regras e Dados):**
        *   Logs de regras do Firestore não são diretamente visíveis como logs de execução de código, mas você pode usar o "Rules Playground" no console do Firebase para testar suas regras.
        *   Para dados, o console do Firebase permite visualizar e gerenciar os dados. Auditoria de acesso pode ser configurada via Cloud Audit Logs se necessário.
    *   **Cloud Functions:**
        *   **Logs:** No Console do Google Cloud (GCP), vá para "Logging" > "Logs Explorer". Filtre por "Cloud Function" e selecione o nome da sua função. Alternativamente, no console do Firebase, vá para a seção "Functions" e clique nos logs de uma função específica.
        *   **Rollback:** Para Cloud Functions, você pode fazer o deploy de uma versão anterior do código da função. O Firebase CLI permite fazer o deploy de uma função específica. Se você versiona seu código em Git, pode reverter para um commit anterior e fazer o deploy.
    *   **Firebase Hosting (se usado diretamente):**
        *   **Rollback:** Na seção "Hosting" do console do Firebase, você pode ver o histórico de deploys e reverter para uma versão anterior.

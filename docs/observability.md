# Observabilidade e Alertas

Este guia apresenta os passos para instrumentar logs, configurar alertas e monitorar métricas tanto no Sentry quanto no Google Cloud Monitoring.

---

## 1. Instalação e Configuração do Logger

### 1.1. Frontend (Next.js)

1. Crie o arquivo `src/lib/logger.ts` com um wrapper de logger (exemplo usando `pino`):

   ```ts
   import pino from 'pino';

   export const logger = pino({
     timestamp: pino.stdTimeFunctions.isoTime,
     level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
   });

   export function logAction(
     userId: string | null,
     action: string,
     meta: Record<string, any> = {}
   ) {
     logger.info({ userId, action, meta }, 'action');
   }
   ```
2. Para registrar ações no frontend, importe e use:

   ```ts
   import { logAction } from '@/lib/logger';
   logAction(user.uid, 'login_success');
   ```

### 1.2. Backend (Cloud Functions)

1. Use o logger nativo do Firebase Functions:

   ```ts
   import * as functions from 'firebase-functions';

   export const onUserCreate = functions.auth.user().onCreate((user) => {
     functions.logger.info('Role set on user creation', { uid: user.uid });
   });
   ```

---

## 2. Exportação de Logs para Cloud Logging (Stackdriver)

1. No Console GCP, habilite a API **Cloud Logging** para os projetos `thalamus-prod` e `thalamus-staging`.
2. Configure as credenciais de serviço no ambiente de execução:

   * Defina a variável `GOOGLE_APPLICATION_CREDENTIALS` apontando para o JSON da conta de serviço.
   * No `Dockerfile`, adicione:

     ```dockerfile
     COPY service-account.json /var/secrets/service-account.json
     ENV GOOGLE_APPLICATION_CREDENTIALS=/var/secrets/service-account.json
     ```
3. Teste localmente:

   ```bash
   gcloud auth activate-service-account --key-file=service-account.json
   gcloud logging write "LOG_TEST" "Test log entry" --severity=INFO
   ```

   Verifique em **Logging > Logs Explorer** no Console GCP.

---

## 3. Alertas de Erro no Sentry

1. Acesse o projeto no painel do Sentry.
2. Navegue até **Issues > Alerts** e clique em **Create Alert Rule**.
3. Defina estes gatilhos:

   * **Mais de 5 eventos** com nível `error` no mesmo endpoint em **10 minutos**.
   * **Taxa de respostas 5xx** maior que **3%** em **10 minutos**.
4. Escolha canal de notificação (e-mail, Slack) e salve.

Inclua capturas de tela na pasta `docs/images/`, por exemplo:

* `docs/images/sentry-error-alert.png`
* `docs/images/sentry-5xx-rate.png`

---

## 4. Políticas de Monitoramento no Cloud Monitoring

1. No Console GCP, vá para **Monitoring > Alerting** e clique em **Create Policy**.
2. Crie duas condições:

   * **Latência média do Next.js** > **200 ms** por **5 minutos**:

     * Resource: Cloud Run / App Service
     * Metric: Latency
     * Operator: Greater than 0.2s
   * **Uso de CPU do container** > **80%** por **5 minutos**:

     * Resource: Kubernetes Container / Cloud Run
     * Metric: CPU Usage
     * Operator: Greater than 80%
3. Configure canais de notificação (e-mail, Slack) e salve.

Adicione imagens em `docs/images`:

* `gcm-latency-alert.png`
* `gcm-cpu-alert.png`

---

## 5. Visualizando Logs e Consultas Úteis

1. Acesse **Logging > Logs Explorer** no Console GCP.
2. Selecione o recurso (Cloud Functions ou Cloud Run).
3. Exemplos de consultas:

   * **Erros de Cloud Functions**:

     ```
     resource.type="cloud_function"
     severity>=ERROR
     ```
   * **Ações de login** (frontend logs):

     ```
     jsonPayload.action="login_success"
     ```
   * **Mensagens específicas do frontend**:

     ```
     textPayload:"patient_created"
     ```

---

*Last updated: XX/XX/XXXX*

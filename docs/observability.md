# Observabilidade

Este guia apresenta os passos para registrar e monitorar eventos da aplicação, além de configurar alertas.

## Instalação e Configuração do Logger

1. O projeto utiliza um logger simples em `src/lib/logger.ts`.
2. Para registrar ações no frontend, importe a função `logAction` e chame-a informando o `userId` e a descrição do evento:
   ```ts
   import { logAction } from '@/lib/logger';
   logAction(user.uid, 'login_success');
   ```
3. Em Cloud Functions, utilize `functions.logger` para que as mensagens sejam enviadas ao Cloud Logging automaticamente:
   ```ts
   import * as functions from 'firebase-functions';
   functions.logger.info('Role set on user creation', { uid });
   ```

## Visualizando Logs no Cloud Logging

1. Acesse o [Console do GCP](https://console.cloud.google.com/).
2. Selecione **Logging > Logs Explorer**.
3. Utilize o seletor de recursos para filtrar pelos serviços utilizados (Cloud Functions ou Cloud Run).
4. Pesquise pelos rótulos ou textos que foram enviados no logger.

## Alertas no Sentry

1. Crie uma conta no [Sentry](https://sentry.io/).
2. Defina um novo projeto **Next.js** ou **Node.js** conforme a necessidade.
3. No painel do projeto, acesse **Alerts > Create Alert**.
4. Configure a regra desejada, como taxa de erros ou mensagens específicas.
5. Salve e teste o alerta forçando um erro em ambiente de staging.

## Alertas no Cloud Monitoring

1. No [Console do GCP](https://console.cloud.google.com/), abra **Monitoring > Alerting**.
2. Clique em **Criar política** e defina uma condição de métrica ou de logs.
3. Para logs, selecione **Log-based** e forneça a consulta que deseja monitorar.
4. Configure o canal de notificação (e-mail ou webhook) e salve.

## Queries Úteis no Logs Explorer

- Erros de Cloud Functions:
  ```
  resource.type="cloud_function"
  severity>=ERROR
  ```
- Ações de login:
  ```
  jsonPayload.action="login_success"
  ```
- Consultar mensagens específicas do frontend:
  ```
  textPayload:"patient_created"
  ```

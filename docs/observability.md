# Observabilidade e Alertas

Este guia descreve como configurar regras de monitoramento no Sentry e no Google Cloud Monitoring para acompanhar erros, latência e uso de CPU do sistema.

## 1. Alertas de Erro no Sentry

1. Acesse o projeto no painel do Sentry.
2. Navegue até **Issues > Alerts** e clique em **Create Alert Rule**.
3. Defina os seguintes gatilhos:
   - **Mais de 5 eventos** com nível `error` em um mesmo endpoint dentro de **10 minutos**.
   - **Taxa de respostas 5xx maior que 3%** no mesmo período.
4. Escolha o canal de notificação (e-mail, Slack, etc.) e salve.

## 2. Políticas de Monitoramento no Cloud Monitoring

1. Abra o **Google Cloud Console** e acesse **Monitoring**.
2. Em **Alerting**, clique em **Create Policy**.
3. Crie duas condições separadas:
   - **Latência média do Next.js** acima de **200 ms** por **5 minutos**.
   - **Uso de CPU do container** acima de **80%** por **5 minutos**.
4. Defina os canais de notificação desejados e salve a política.

## 3. Referências Visuais

Inclua capturas de tela dos formulários de configuração para documentar cada etapa. Salve as imagens na pasta `docs/images` com nomes descritivos, como `sentry-alert.png` e `gcm-latency.png`.

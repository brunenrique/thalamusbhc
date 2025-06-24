# Alertas de Produção

Este guia apresenta como criar políticas de alerta no **Cloud Monitoring** e no **Sentry** para monitorar o desempenho do backend.

## 1. Cloud Monitoring

1. Acesse **Monitoring > Alerting** no Console GCP e clique em **Create Policy**.
2. Adicione a condição **Response latency** > **2 s** por **1 minuto** para o serviço de backend (Cloud Run ou App Service).
3. Crie outra condição com **HTTP 5xx rate** acima de **5%** em **5 minutos**.
4. Defina canais de notificação (e-mail, Slack) e salve.

Inclua capturas de tela em `docs/images/`, por exemplo `gcm-latency-2s.png` e `gcm-5xx-rate.png`.

## 2. Sentry

1. No painel do Sentry, abra **Issues > Alerts** e selecione **Create Alert Rule**.
2. Configure o gatilho **If ≥ 3 events** para o endpoint `/insights` em **10 minutos**.
3. Habilite filtro para **status >= 500** caso existam erros do backend.
4. Escolha o canal de notificação e salve a regra.

Inclua uma captura de tela em `docs/images/sentry-insights-alert.png`.

---

*Last updated: XX/XX/XXXX*

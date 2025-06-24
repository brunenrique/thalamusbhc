

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

# Políticas de Alerta de Produção

Este documento resume as regras de monitoramento no Google Cloud Monitoring e Sentry para garantir que o sistema responda rapidamente e sem erros.

## Cloud Monitoring

1. Acesse **Monitoring > Alerting** no Console GCP e clique em **Create Policy**.
2. Defina uma condição chamada **Latência HTTP**:
   - Recurso: Cloud Run ou App Service do Next.js.
   - Métrica: `request latency` ou `Response latency`.
   - Operador: `>` **2 s** com janela de **5 minutos**.
3. Adicione outra condição chamada **Erros 5xx**:
   - Recurso: mesmo serviço do backend.
   - Métrica: `HTTP 5xx rate`.
   - Operador: `>` **5%** em **5 minutos**.
4. Para monitorar falhas na rota `/insights`, crie uma métrica baseada em log filtrando `resource.label."path"="/insights"` e a use em uma condição de **número de entradas de log com severidade ERROR** consecutivas em 5 minutos.
5. Configure canais de notificação (e-mail ou Slack) e salve a política.

## Sentry

1. No painel do projeto, navegue até **Issues > Alerts** e clique em **Create Alert Rule**.
2. Regra **Latência elevada**:
   - Trigger: picos de `Transaction Duration` acima de **2 s** em 5 minutos.
   - Ação: enviar notificação para o canal definido.
3. Regra **Erros 5xx**:
   - Trigger: mais de **5 eventos** HTTP 5xx em 10 minutos.
4. Regra **Falhas em `/insights`**:
   - Trigger: **3 erros consecutivos** para a transação ou endpoint `/insights`.
5. Salve e teste os alertas enviando erros de exemplo.

*Last updated: 06/2025*


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

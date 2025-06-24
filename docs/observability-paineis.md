# Painéis de Observabilidade

Este guia lista os principais painéis no Firebase Console e no Google Cloud para acompanhar a operação do sistema.

## 1. Número de sessões

1. No **Firebase Console**, abra **Analytics > Dashboard**.
2. Selecione o intervalo de tempo desejado.
3. Observe o gráfico **Sessions** para identificar picos de acesso.

## 2. Custo diário

1. No **Google Cloud Console**, acesse **Billing > Reports**.
2. Escolha o projeto correspondente.
3. Defina a visualização como **Daily cost** para acompanhar gastos diários.
4. Em **Budgets & alerts**, crie alertas para evitar surpresas na fatura.

## 3. Erros e exceções

1. No **Logs Explorer** do GCP, filtre por `severity>=ERROR` para ver falhas do backend.
2. No Firebase, utilize **Crashlytics** para erros no app cliente.
3. Revise periodicamente para agir rápido em problemas recorrentes.

## 4. Tempo médio de resposta da API

1. No **Monitoring > Metrics explorer**, selecione o serviço Cloud Run ou Cloud Functions.
2. Escolha a métrica **latency** e agregue por média (mean).
3. Crie um painel fixo em **Dashboards** para acompanhar a tendência de desempenho.

---

*Last updated: 10/2023*

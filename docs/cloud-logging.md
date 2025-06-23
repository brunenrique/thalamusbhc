# Cloud Logging

Para que os logs do aplicativo apareçam no Google Cloud, é necessário habilitar a API **Cloud Logging** manualmente nos projetos `thalamus-prod` e `thalamus-staging`.

```bash
# Execute uma vez para cada projeto
 gcloud services enable logging.googleapis.com --project=thalamus-prod
 gcloud services enable logging.googleapis.com --project=thalamus-staging
```

Após habilitar, verifique localmente com o comando abaixo (substituindo pela sua chave de serviço):

```bash
gcloud logging write test-log "teste de envio" --project=thalamus-staging
```

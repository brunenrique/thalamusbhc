# Teste Lighthouse

Para coletar métricas de performance localmente utilize o **Lighthouse CI**.

```bash
npx lhci autorun --collect.url=http://localhost:3000 --upload.target=filesystem --upload.outputDir=public
```

O relatório será salvo em `public/lh-report.html`. Abra o arquivo no navegador para verificar as notas.

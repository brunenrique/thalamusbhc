# Analisando o tamanho do bundle

Este projeto utiliza o plugin `@next/bundle-analyzer` para gerar relatórios do tamanho dos chunks do Next.js.

## Instalação

```bash
npm install --save-dev @next/bundle-analyzer
```

## Configuração

Edite `next.config.ts` adicionando o plugin e exportando o resultado:

```ts
import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default bundleAnalyzer(nextConfig);
```

## Gerando o relatório

Execute o build no modo de profile definindo `ANALYZE=true`:

```bash
ANALYZE=true npm run build --profile
```

Os arquivos `edge.html` e `nodejs.html` serão criados em `.next/analyze`.
Abra esses arquivos em um navegador para ver o tamanho de cada chunk.

Para encontrar dependências acima de **50 KB**, procure na seção "Parsed Size" do
relatório e verifique quais módulos excedem esse valor. Eles podem ser otimizados
com `dynamic import()` ou divisão de código.

# Cache de Respostas da IA

Os serviços de IA usam um cache local no navegador para evitar chamadas
repetidas. A chave do cache é gerada com SHA-256 sobre o corpo da
requisição e cada entrada expira em dez minutos.

Ao solicitar o mesmo conteúdo dentro desse período, o dado salvo em
`localStorage` é retornado imediatamente, sem nova requisição de rede.

# Credenciais Temporárias em Staging

Para conceder acesso seguro aos ambientes de testes, utilize contas específicas com prazo de expiração curto.

1. Execute o script `scripts/create-pentester-user.ts` informando e‑mail e senha desejados. O papel `pentester` é aplicado automaticamente.
   ```bash
   npx tsx scripts/create-pentester-user.ts teste@example.com SenhaForte123!
   ```
2. Registre a validade (ex.: 24h) e comunique o e‑mail e senha apenas por canal seguro (1Password ou mensagem criptografada).
3. Ao final do período, desative ou exclua o usuário via Firebase Console ou CLI:
   ```bash
   firebase auth:delete <uid>
   ```

Esse procedimento garante que cada rodada de verificações use credenciais isoladas e descartáveis, reduzindo riscos de acesso não autorizado.

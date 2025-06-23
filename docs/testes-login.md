# Testes de Login

Este checklist orienta a validação manual dos fluxos de cadastro, autenticação e controle de acesso.

## 1. Signup como psicólogo

- [ ] Acessar `/signup`.
- [ ] Preencher e‑mail, senha e confirmação.
- [ ] Selecionar o papel **psychologist**.
- [ ] Enviar e verificar redirecionamento para a área logada.
- [ ] Conferir no Firestore que o campo `role` está definido como `psychologist`.

## 2. Login com credenciais válidas

- [ ] Acessar `/login`.
- [ ] Informar e‑mail e senha cadastrados.
- [ ] Confirmar se o sistema autentica e redireciona para o painel principal.

## 3. Acesso negado para papel incorreto

- [ ] Autenticar um usuário com papel diferente de `psychologist`.
- [ ] Tentar acessar uma rota restrita a psicólogos, como `/dashboard`.
- [ ] Verificar exibição de mensagem de acesso negado ou redirecionamento para a página de permissão insuficiente.

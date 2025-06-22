# Análise da Trilha de Auditoria

## 1. Gatilhos de Auditoria

Nenhuma das operações de CRUD nos serviços `prontuarioService.ts` e `appointmentService.ts`, nem o endpoint de login em `src/app/api/login/route.ts`, executa chamadas para registrar logs de auditoria. As funções manipulam dados (ex.: criação de notas de sessão e agendamentos) sem gerar registros na coleção de auditoria.

**Recomendação:** implementar uma função utilitária para gravar um documento na coleção `auditLogs` a cada operação sensível, sendo chamada sempre que notas, agendamentos ou sessões de login forem criados, lidos, atualizados ou excluídos.

## 2. Conteúdo do Log

Não existe estrutura definida para os registros de auditoria no código atual. Assim, campos essenciais como `userId`, `actionType`, `timestamp` e `targetResourceId` não são salvos.

**Recomendação:** definir um esquema para `auditLogs` contendo ao menos:

- `userId`: identificador do usuário responsável pela ação;
- `actionType`: descrição da ação (ex.: `createAppointment`, `login`);
- `timestamp`: data e hora geradas no servidor;
- `targetResourceId`: id do recurso afetado.

## 3. Imutabilidade do Log

Não há regras de segurança para a coleção de auditoria. Sem regras específicas, usuários autenticados podem potencialmente alterar ou remover registros.

**Recomendação:** adicionar ao `firestore.rules` a entrada abaixo para impedir modificações e exclusões:

```firestore
match /auditLogs/{id} {
  allow create: if request.auth != null;
  allow update, delete: if false;
  allow read: if isAdmin();
}
```

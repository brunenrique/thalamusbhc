# Análise da Trilha de Auditoria

## 1. Gatilhos de Auditoria

As operações de criação de notas de sessão e de agendamentos já utilizam o serviço `writeAuditLog` (em `src/services/auditLogService.ts`) para registrar entradas na coleção `auditLogs`. O endpoint de login (`src/app/api/login/route.ts`) também grava um log após a autenticação bem-sucedida. Atualizações e exclusões, entretanto, ainda não geram registros.

Exemplo de chamada no endpoint de login:

```ts
await writeAuditLog(
  {
    userId: decoded.uid,
    actionType: 'login',
    timestamp: new Date().toISOString(),
    targetResourceId: decoded.uid,
  },
  firestoreAdmin
);
```

**Recomendação:** revisar cada serviço para garantir que chamadas ao `writeAuditLog` sejam feitas em todas as ações sensíveis (criação, leitura, atualização e exclusão).

## 2. Conteúdo do Log

O serviço `writeAuditLog` recebe objetos do tipo `AuditLogEntry`, que já definem os campos básicos do log: `userId`, `actionType`, `timestamp` e `targetResourceId`. Esses valores são persistidos diretamente na coleção `auditLogs`.

**Recomendação:** manter esse esquema simples e garantir que cada chamada forneça as informações necessárias.

## 3. Imutabilidade do Log

O arquivo `firestore.rules` já define restrições específicas para a coleção `auditLogs`, permitindo apenas a criação por usuários autenticados e leitura exclusiva por administradores. Atualizações e exclusões são bloqueadas.

```firestore
match /auditLogs/{id} {
  allow create: if request.auth != null;
  allow read: if isAdmin();
  allow update, delete: if false;
}
```

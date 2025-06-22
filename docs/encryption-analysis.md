# Análise de Criptografia de Dados Sensíveis

O módulo `src/lib/crypto-utils.ts` implementa criptografia AES-256-GCM. A chave é obtida via `getEncryptionKey()` em `src/lib/encryptionKey.ts`, que por sua vez depende de `setEncryptionPassword()` para definir uma senha em memória. A chave não está hard-coded no repositório e deve ser fornecida por variável de ambiente ou processo de inicialização.

## Campos Criptografados

- **Notas de Sessão** (`sessionNotes`): o conteúdo textual da nota é criptografado antes de ser salvo. A função `saveSessionNote` gera objetos com campos `ciphertext`, `iv` e `tag`.

## Campos Não Criptografados

- Dados de pacientes (ex.: `name`, `email`, `avatarUrl`).
- Informações de agendamentos (`appointmentDate`, `patientId`, `psychologistId`, etc.).

Atualmente não há evidências de criptografia para PII como CPF, endereço ou telefone (caso venham a ser adicionados).

## Recomendações

1. Avaliar a necessidade de criptografar campos adicionais de pacientes, especialmente se incluírem PII/PHI como CPF, endereço completo ou telefone.
2. Garantir que a senha utilizada em `setEncryptionPassword()` seja obtida via variável de ambiente segura (`ENCRYPTION_KEY`) ou fluxo de login do profissional, nunca armazenando em texto plano.
3. Documentar o procedimento de definição da chave no início da aplicação para evitar operações sem criptografia.

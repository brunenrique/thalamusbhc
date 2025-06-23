# Análise de Criptografia de Dados Sensíveis

O módulo `src/lib/crypto-utils.ts` implementa criptografia AES-256-GCM. A chave é obtida via `getEncryptionKey()` em `src/lib/encryptionKey.ts`, que por sua vez depende de `setEncryptionPassword()` para definir uma senha em memória. A chave não está hard-coded no repositório e deve ser fornecida por variável de ambiente ou processo de inicialização.

## Campos Criptografados

- **Notas de Sessão** (`sessionNotes`): o conteúdo textual da nota é criptografado antes de ser salvo. A função `saveSessionNote` gera objetos com campos `ciphertext`, `iv` e `tag`.
- **Dados Sensíveis de Pacientes** (`patients`): campos `phoneEnc`, `addressEnc` e `identifierEnc` são objetos cifrados com `ciphertext`, `iv` e `tag`.

## Campos Não Criptografados

- Dados básicos de pacientes (`name`, `email`, `avatarUrl`).
- Informações de agendamentos (`appointmentDate`, `patientId`, `psychologistId`, etc.).

## Recomendações

1. Avaliar a necessidade de criptografar campos adicionais de pacientes, especialmente se incluírem PII/PHI como CPF, endereço completo ou telefone.
2. Garantir que a senha utilizada em `setEncryptionPassword()` seja obtida via variável de ambiente segura (`ENCRYPTION_KEY`) ou fluxo de login do profissional, nunca armazenando em texto plano.
3. Documentar o procedimento de definição da chave no início da aplicação para evitar operações sem criptografia.

## Migração de Pacientes Existentes

Para bases já em produção é necessário criptografar retrospectivamente os campos sensíveis de cada paciente. O passo a passo sugerido é:

1. Carregue todos os documentos da coleção `patients` com uma conta administrativa.
2. Para cada paciente, leia os valores em texto plano (`phone`, `address`, `identifier`).
3. Utilize `encrypt()` com a chave derivada em `getEncryptionKey()` e grave os resultados nos novos campos `phoneEnc`, `addressEnc` e `identifierEnc`.
4. Remova os campos antigos em texto plano após verificar a consistência dos dados criptografados.

Este processo deve ser executado uma única vez e preferencialmente em script de migração utilizando os emuladores do Firebase para validação.

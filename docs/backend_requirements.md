# Requisitos e Regras para o Backend

Este documento lista funcionalidades e regras de negócio que precisam ser implementadas ou suportadas pelo backend da aplicação PsiGuard.

## Gerenciamento de Agendamentos

1.  **Validação de Conflito de Horários:**
    *   O sistema não deve permitir que dois pacientes diferentes sejam agendados para o mesmo psicólogo no mesmo horário.
    *   Ao tentar criar ou atualizar um agendamento, o backend deve verificar se já existe um agendamento para o psicólogo selecionado que se sobreponha ao intervalo de tempo do novo agendamento.
    *   Uma mensagem de erro clara deve ser retornada ao frontend se um conflito for detectado.
    *   **Exceção:** Horários bloqueados (`isBlockTime: true`) não devem ser considerados conflitos para outros agendamentos do tipo "bloqueio", mas devem impedir agendamentos de pacientes. (A definir: um psicólogo pode ter múltiplos bloqueios sobrepostos se for para diferentes motivos? Provavelmente não, o bloqueio deve ser único para o intervalo).
    *   Considerar a lógica para agendamentos recorrentes durante a verificação de conflitos.

## Segurança de Dados e Prontuários

1.  **Criptografia de Prontuários (Client-Side AES):**
    *   **Requisito Crítico:** Dados sensíveis dos prontuários dos pacientes (ex: notas de sessão, histórico médico detalhado, resultados de avaliações confidenciais) devem ser protegidos utilizando criptografia forte, preferencialmente AES (Advanced Encryption Standard) do lado do cliente (client-side encryption).
    *   **Fluxo Geral:**
        *   Os dados sensíveis são criptografados no navegador do profissional *antes* de serem transmitidos e armazenados no backend (Firestore).
        *   Os dados são armazenados de forma criptografada no Firestore.
        *   Ao serem recuperados, os dados são descriptografados no navegador do profissional autorizado.
    *   **Gerenciamento de Chaves:**
        *   Esta é a parte mais complexa e vital. A chave de criptografia NUNCA deve ser armazenada descriptografada no servidor ou ser diretamente acessível pelo backend de forma a comprometer a confidencialidade.
        *   **Opção 1 (Derivada de Senha):** A chave de criptografia pode ser derivada de uma senha mestra do profissional (distinta da senha de login, ou a mesma com salt forte e PBKDF2/Argon2). O profissional precisaria inserir esta senha para descriptografar os prontuários.
            *   **Desafio:** Se a senha for esquecida, os dados criptografados com a chave derivada são irrecuperáveis. Mecanismos de recuperação de senha para a chave de criptografia são complexos e podem introduzir vetores de ataque se não implementados corretamente.
        *   **Opção 2 (Chave Gerenciada pelo Cliente):** Soluções onde a chave é gerenciada pelo cliente, mas isso pode ser complexo para o usuário final.
    *   **Escopo da Criptografia:**
        *   Identificar claramente quais campos de dados são considerados sensíveis e requerem criptografia. Campos não sensíveis (ex: nome do paciente para listagem, datas de agendamento) podem permanecer não criptografados para permitir buscas e indexação.
        *   Notas de sessão, diagnósticos, resumos de tratamento, e respostas detalhadas de avaliações são candidatos primários para criptografia.
    *   **Impacto na Funcionalidade:**
        *   **Busca:** Dados criptografados no Firestore não podem ser pesquisados diretamente pelo conteúdo (ex: buscar todas as notas que mencionam "ansiedade"). Estratégias de metadados não criptografados ou técnicas de "searchable encryption" (altamente complexas) podem ser necessárias para funcionalidades de busca limitadas.
        *   **Compartilhamento de Dados:** Se os dados precisarem ser compartilhados entre profissionais, o gerenciamento e compartilhamento seguro das chaves de descriptografia se torna um desafio adicional.
        *   **Geração de Insights por IA:** Se a IA opera no backend, ela não terá acesso ao conteúdo descriptografado das notas de sessão se a criptografia for estritamente client-side e a chave não for exposta ao backend. Isso limitaria a capacidade da IA de analisar o conteúdo textual das notas, a menos que a descriptografia ocorra no cliente e os dados sejam enviados para a IA (o que precisa ser cuidadosamente avaliado em termos de segurança e privacidade).
    *   **Considerações de Performance:** Criptografia/descriptografia no cliente pode adicionar uma pequena sobrecarga de processamento, especialmente para grandes volumes de texto.
    *   **Biblioteca:** Utilizar bibliotecas de criptografia bem estabelecidas e testadas (ex: `crypto-js` para JavaScript, ou a API Web Crypto nativa do navegador).

## (Próximas Regras a Serem Adicionadas)

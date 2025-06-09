# Requisitos e Regras para o Backend

Este documento lista funcionalidades e regras de negócio que precisam ser implementadas ou suportadas pelo backend da aplicação PsiGuard.

## Gerenciamento de Agendamentos

1.  **Validação de Conflito de Horários:**
    *   O sistema não deve permitir que dois pacientes diferentes sejam agendados para o mesmo psicólogo no mesmo horário.
    *   Ao tentar criar ou atualizar um agendamento, o backend deve verificar se já existe um agendamento para o psicólogo selecionado que se sobreponha ao intervalo de tempo do novo agendamento.
    *   Uma mensagem de erro clara deve ser retornada ao frontend se um conflito for detectado.
    *   **Exceção:** Horários bloqueados (`isBlockTime: true`) não devem ser considerados conflitos para outros agendamentos do tipo "bloqueio", mas devem impedir agendamentos de pacientes. (A definir: um psicólogo pode ter múltiplos bloqueios sobrepostos se for para diferentes motivos? Provavelmente não, o bloqueio deve ser único para o intervalo).
    *   Considerar a lógica para agendamentos recorrentes durante a verificação de conflitos.

## (Próximas Regras a Serem Adicionadas)

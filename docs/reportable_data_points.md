
# Pontos de Dados Coletáveis para Geração de Relatórios Estatísticos com IA

Esta lista detalha os diversos pontos de dados que podem ser coletados pela plataforma Thalamus para alimentar a geração de relatórios estatísticos, incluindo aqueles auxiliados por Inteligência Artificial. Os dados são categorizados para melhor compreensão e aplicação.

## 1. Detalhes Administrativos da Clínica

Estes dados focam na operação e gestão da clínica.

### 1.1. Pacientes
- Número total de pacientes ativos
- Número de novos pacientes (por período: semana, mês, ano)
- Taxa de retenção de pacientes (novos pacientes vs. desligamentos)
- Taxa de desligamento/alta de pacientes
- Distribuição demográfica dos pacientes (se coletado e com consentimento):
    - Faixa etária
    - Gênero
    - Outros dados demográficos relevantes e permitidos
- Origem dos pacientes (como souberam da clínica: indicação, pesquisa online, etc.)
- Status dos pacientes (ativo, inativo, arquivado, alta terapêutica)
- Dados da lista de espera:
    - Número de pessoas na lista
    - Tempo médio de espera
    - Taxa de conversão da lista para pacientes ativos
    - Motivos de procura (se coletado na entrada da lista)
    - Prioridade na lista

### 1.2. Agendamentos e Sessões
- Número total de sessões realizadas (por período: dia, semana, mês)
- Número de sessões por psicólogo
- Tipos de sessão mais frequentes (ex: consulta inicial, acompanhamento, terapia de casal, grupo, avaliação)
- Duração média das sessões (geral e por tipo)
- Taxa de ocupação da agenda (geral da clínica e por psicólogo)
- Taxa de não comparecimento (no-show)
- Taxa de cancelamento (geral, por paciente, pela clínica)
- Taxa de remarcação de sessões
- Horários de pico para agendamentos (dias da semana, períodos do dia)
- Tempo médio entre sessões para um mesmo paciente
- Número de sessões bloqueadas (por psicólogo, por motivo)
- Modalidade das sessões (presencial, online)

### 1.3. Psicólogos
- Número de psicólogos ativos na plataforma
- Carga horária média de atendimento por psicólogo
- Número médio de pacientes ativos por psicólogo
- Especialidades/abordagens dos psicólogos (se cadastrado)

### 1.4. Grupos Terapêuticos
- Número de grupos terapêuticos ativos
- Número médio de participantes por grupo
- Tipos de grupos mais frequentes (ex: ansiedade, habilidades sociais, luto)
- Taxa de adesão e desistência em grupos
- Frequência e duração das sessões de grupo

### 1.5. Financeiro (se o módulo estiver habilitado e dados forem coletados)
- Receita total (por período)
- Receita por psicólogo
- Receita por tipo de serviço/sessão
- Receita por convênio (se aplicável)
- Valor médio por sessão
- Taxa de inadimplência
- Despesas da clínica (categorizadas)
- Lucratividade

## 2. Detalhes do Sistema (Uso da Plataforma Thalamus)

Estes dados referem-se à interação dos usuários com a plataforma.

- Frequência de uso de cada módulo principal (agenda, pacientes, notas, tarefas, grupos, etc.)
- Adoção de ferramentas de IA (ex: geração de rascunho de notas, insights de sessão, sugestão de modelos)
- Criação e utilização de modelos de anotação e documentos
- Criação e compartilhamento de recursos (PDFs, links, etc.)
- Frequência de aplicação e preenchimento de inventários/escalas
- Frequência de login dos usuários (psicólogos, secretaria, admin)
- Tempo médio de sessão na plataforma por usuário
- Ações mais comuns realizadas na plataforma
- Volume de mensagens trocadas no chat interno (se aplicável)
- Utilização da trilha de auditoria (frequência de acesso)
- Utilização da funcionalidade de backup

## 3. Detalhes de Análise Clínica

Estes dados podem ser agregados e anonimizados para fornecer uma visão geral da clínica, ou analisados individualmente para o psicólogo refletir sobre sua prática (respeitando a privacidade e ética).

### 3.1. Perfil Clínico Geral (Agregado e Anonimizado para a Clínica)
- Principais queixas/motivos de consulta (baseado em tags, palavras-chave das notas de sessão, ou campos estruturados no cadastro do paciente)
- Distribuição de diagnósticos (CID/DSM – se utilizado e permitido eticamente)
- Comorbidades mais frequentemente identificadas (se registrado)
- Faixas etárias predominantes para diferentes queixas
- Tempo médio de tratamento para diferentes tipos de queixas/transtornos
- Prevalência de temas abordados em terapia (ex: ansiedade, depressão, relacionamentos, trabalho, luto)

### 3.2. Evolução e Resultados Terapêuticos (Agregado e Anonimizado para a Clínica; Individual para o Psicólogo)
- Evolução de sintomas ao longo do tempo (medida por escalas padronizadas como BDI, GAD-7, etc.)
- Progressão em direção às metas terapêuticas (se as metas forem registradas de forma estruturada e seu progresso atualizado)
- Duração média do processo terapêutico até a alta
- Taxa de alta terapêutica (pacientes que concluíram o tratamento com sucesso)
- Taxa de abandono de tratamento e possíveis fatores correlacionados
- Comparação de resultados de escalas antes/depois de intervenções específicas (análise cuidadosa e contextualizada)
- Feedback de satisfação do paciente com o tratamento (se coletado via formulários)

### 3.3. Prática Clínica e Intervenções (Individual para o Psicólogo; Agregado/Anonimizado para Supervisão/Gestão Clínica)
- Tipos de intervenção mais utilizados (identificados a partir de notas de sessão, tags ou campos estruturados)
- Adesão dos pacientes às tarefas de casa ou exercícios propostos
- Temas mais recorrentes nas sessões de um psicólogo específico
- Utilização de diferentes instrumentos/escalas por psicólogo
- Frequência de encaminhamentos para outros profissionais/serviços
- Padrões na duração das sessões por psicólogo ou tipo de queixa
- Análise de notas de sessão (com IA, respeitando a privacidade e criptografia):
    - Identificação de padrões de linguagem dos pacientes
    - Detecção de sentimentos predominantes (requer análise de texto sofisticada)
    - Identificação de marcos terapêuticos chave
    - Alertas de risco potenciais (ex: ideação suicida, aumento súbito de angústia – requer protocolos éticos e de segurança MUITO RÍGIDOS)

### 3.4. Uso de Recursos e Instrumentos
- Recursos (materiais, PDFs) mais compartilhados com pacientes
- Inventários e escalas mais frequentemente aplicados
- Correlação entre uso de determinados recursos/instrumentos e resultados terapêuticos (análise complexa)

---

**Nota Importante sobre Privacidade e Ética:** A coleta, armazenamento, e especialmente a análise de dados clínicos devem sempre seguir rigorosamente os princípios éticos da psicologia, a legislação de proteção de dados (como a LGPD no Brasil), e garantir a confidencialidade e o consentimento informado dos pacientes. A Inteligência Artificial pode ser uma ferramenta poderosa para identificar padrões, mas a interpretação e aplicação clínica desses dados continuam sendo responsabilidade intransferível do profissional de saúde mental.

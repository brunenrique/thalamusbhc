
import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { Edge, Node, OnNodesChange, OnEdgesChange, Viewport } from 'reactflow';
import type {
  ABCCardData,
  SchemaData,
  ABCTemplate,
  ConnectionLabel,
  ClinicalNodeData,
  ClinicalNodeType
} from '@/types/clinicalTypes';

// Mock inicial para templates
const initialTemplates: ABCTemplate[] = [
  {
    id: nanoid(),
    name: 'Ataque de Pânico',
    antecedentGuide: 'O que estava acontecendo externa e internamente antes do pânico? (Ex: multidão, pensamento "vou passar mal")',
    behaviorGuide: 'Qual foi a principal resposta comportamental ao pânico? (Ex: fugir do local, verificar sensações corporais)',
    consequenceGuide: 'O que aconteceu imediatamente após (alívio, evitação confirmada)? E a longo prazo (perda de oportunidades, reforço da ansiedade)?',
  },
  {
    id: nanoid(),
    name: 'Procrastinação',
    antecedentGuide: 'Qual tarefa estava pendente? Que pensamentos/sentimentos surgiram? (Ex: tarefa difícil, medo de falhar)',
    behaviorGuide: 'Qual comportamento foi realizado em vez da tarefa? (Ex: redes sociais, organizar a mesa)',
    consequenceGuide: 'Qual foi o alívio imediato? Quais foram os custos de curto e longo prazo (Ex: tarefa acumulada, estresse, culpa)?',
  },
  {
    id: nanoid(),
    name: 'Discussão Conjugal',
    antecedentGuide: 'Qual foi o gatilho da discussão? O que cada um estava pensando/sentindo? (Ex: crítica percebida, cansaço)',
    behaviorGuide: 'Como cada um se comportou durante a discussão? (Ex: gritar, silenciar, acusar)',
    consequenceGuide: 'Qual foi o resultado imediato (Ex: afastamento, "vitória" momentânea)? E o impacto no relacionamento a longo prazo (Ex: desgaste, falta de resolução)?',
  }
];

export interface ClinicalState {
  cards: ABCCardData[];
  schemas: SchemaData[];
  templates: ABCTemplate[];
  insights: string[];
  
  nodes: Node<ClinicalNodeData>[];
  edges: Edge<ConnectionLabel | undefined>[]; // Data da aresta pode ser ConnectionLabel ou undefined

  isABCFormOpen: boolean;
  editingCardId: string | null; // ID do card sendo editado, ou null para novo card
  isLabelEdgeModalOpen: boolean;
  pendingEdge: Edge<ConnectionLabel | undefined> | null; // Aresta aguardando rótulo
  viewport: Viewport;

  // Ações para cards
  addCard: (data: Omit<ABCCardData, 'id' | 'position'>) => void;
  updateCard: (cardId: string, updates: Partial<ABCCardData>) => void;
  deleteCard: (cardId: string) => void;
  changeCardColor: (cardId: string, color: ABCCardData['color']) => void;
  updateCardPosition: (cardId: string, position: { x: number; y: number }) => void;


  // Ações para schemas
  addSchema: (data: Omit<SchemaData, 'id' | 'linkedCardIds' | 'position'>) => void;
  updateSchema: (schemaId: string, updates: Partial<SchemaData>) => void;
  deleteSchema: (schemaId: string) => void;
  linkCardToSchema: (schemaId: string, cardId: string) => void;
  unlinkCardFromSchema: (schemaId: string, cardId: string) => void;
  updateSchemaPosition: (schemaId: string, position: { x: number; y: number }) => void;

  // Ações para insights
  setInsights: (insights: string[]) => void;
  addInsight: (insight: string) => void;

  // Ações para React Flow (nodes, edges, viewport)
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addEdge: (edge: Edge<ConnectionLabel | undefined>) => void;
  updateEdgeLabel: (edgeId: string, labelData: ConnectionLabel) => void;
  removeEdge: (edgeId: string) => void;
  setViewport: (viewport: Viewport) => void;
  
  // Controle de Modais
  openABCForm: (cardId?: string) => void;
  closeABCForm: () => void;
  openLabelEdgeModal: (edge: Edge<ConnectionLabel | undefined>) => void;
  closeLabelEdgeModal: () => void;

  // Simulação de fetch
  fetchClinicalData: (patientId: string) => Promise<void>; // Simulado
  saveClinicalData: (patientId: string) => Promise<void>; // Simulado
}

const nodeType: ClinicalNodeType = 'abcCard'; // Helper for default node type

const useClinicalStore = create<ClinicalState>((set, get) => ({
  // Estado inicial
  cards: [],
  schemas: [],
  templates: initialTemplates,
  insights: [],
  nodes: [],
  edges: [],
  isABCFormOpen: false,
  editingCardId: null,
  isLabelEdgeModalOpen: false,
  pendingEdge: null,
  viewport: { x: 0, y: 0, zoom: 1 },

  // --- Ações para Cards ---
  addCard: (data) => {
    const newCard: ABCCardData = { 
      ...data, 
      id: nanoid(),
      position: { x: Math.random() * 400, y: Math.random() * 400 } // Posição aleatória inicial
    };
    set((state) => {
      const newNodes = [
        ...state.nodes,
        { id: newCard.id, type: 'abcCard' as ClinicalNodeType, position: newCard.position!, data: newCard, draggable: true }
      ];
      return { cards: [...state.cards, newCard], nodes: newNodes };
    });
  },
  updateCard: (cardId, updates) =>
    set((state) => {
      const updatedCards = state.cards.map((card) =>
        card.id === cardId ? { ...card, ...updates } : card
      );
      const updatedNodes = state.nodes.map((node) =>
        node.id === cardId && node.type === 'abcCard' ? { ...node, data: { ...node.data, ...updates } as ABCCardData } : node
      );
      return { cards: updatedCards, nodes: updatedNodes };
    }),
  deleteCard: (cardId) =>
    set((state) => {
      // Também remove o card dos schemas vinculados e dos nós/arestas
      const updatedSchemas = state.schemas.map(schema => ({
        ...schema,
        linkedCardIds: schema.linkedCardIds.filter(id => id !== cardId)
      }));
      return {
        cards: state.cards.filter((card) => card.id !== cardId),
        schemas: updatedSchemas,
        nodes: state.nodes.filter((node) => node.id !== cardId),
        edges: state.edges.filter((edge) => edge.source !== cardId && edge.target !== cardId),
      };
    }),
  changeCardColor: (cardId, color) =>
    get().updateCard(cardId, { color }),
  updateCardPosition: (cardId, position) => 
    set(state => ({
      nodes: state.nodes.map(node => node.id === cardId ? {...node, position} : node),
      cards: state.cards.map(card => card.id === cardId ? {...card, position} : card)
    })),

  // --- Ações para Schemas ---
  addSchema: (data) => {
    const newSchema: SchemaData = { 
      ...data, 
      id: nanoid(), 
      linkedCardIds: [],
      position: { x: Math.random() * 400, y: Math.random() * 100 + 400 } // Posição aleatória inicial
    };
    set((state) => {
      const newNodes = [
        ...state.nodes,
        { id: newSchema.id, type: 'schemaNode' as ClinicalNodeType, position: newSchema.position!, data: newSchema, draggable: true }
      ];
      return { schemas: [...state.schemas, newSchema], nodes: newNodes };
    });
  },
  updateSchema: (schemaId, updates) => 
    set((state) => {
      const updatedSchemas = state.schemas.map((schema) =>
        schema.id === schemaId ? { ...schema, ...updates } : schema
      );
      const updatedNodes = state.nodes.map((node) =>
        node.id === schemaId && node.type === 'schemaNode' ? { ...node, data: { ...node.data, ...updates } as SchemaData } : node
      );
      return { schemas: updatedSchemas, nodes: updatedNodes };
    }),
  deleteSchema: (schemaId) =>
    set((state) => ({
      schemas: state.schemas.filter((schema) => schema.id !== schemaId),
      nodes: state.nodes.filter((node) => node.id !== schemaId),
      // Arestas vinculadas a schemas não são padrão, mas pode ser útil limpar arestas se existirem
    })),
  linkCardToSchema: (schemaId, cardId) =>
    set((state) => ({
      schemas: state.schemas.map((schema) =>
        schema.id === schemaId && !schema.linkedCardIds.includes(cardId)
          ? { ...schema, linkedCardIds: [...schema.linkedCardIds, cardId] }
          : schema
      ),
    })),
  unlinkCardFromSchema: (schemaId, cardId) =>
    set((state) => ({
      schemas: state.schemas.map((schema) =>
        schema.id === schemaId
          ? { ...schema, linkedCardIds: schema.linkedCardIds.filter((id) => id !== cardId) }
          : schema
      ),
    })),
  updateSchemaPosition: (schemaId, position) =>
    set(state => ({
      nodes: state.nodes.map(node => node.id === schemaId ? {...node, position} : node),
      schemas: state.schemas.map(schema => schema.id === schemaId ? {...schema, position} : schema)
    })),

  // --- Ações para Insights ---
  setInsights: (insights) => set({ insights }),
  addInsight: (insight) => set(state => ({ insights: [...state.insights, insight] })),

  // --- Ações para React Flow ---
  onNodesChange: (changes) => {
    set((state) => {
      const newNodes = changes.reduce((acc, change) => {
        if (change.type === 'remove') {
          return acc.filter(node => node.id !== change.id);
        }
        if (change.type === 'position' && change.position) {
          const nodeToUpdate = acc.find(node => node.id === change.id);
          if (nodeToUpdate) {
            const updatedData = { ...nodeToUpdate.data, position: change.position };
            if (nodeToUpdate.type === 'abcCard') {
              get().updateCard(change.id, { position: change.position });
            } else if (nodeToUpdate.type === 'schemaNode') {
              get().updateSchema(change.id, { position: change.position });
            }
            return acc.map(node => node.id === change.id ? { ...node, position: change.position, data: updatedData } : node);
          }
        }
        // Para outros tipos de 'NodeChange' (select, dimensions, etc.), aplique-os diretamente.
        // Esta é uma simplificação. `applyNodeChanges` do React Flow é mais robusto.
        // Mas para apenas posição e remoção manual, isso pode ser suficiente por ora.
        // Ou, para uma abordagem mais simples:
        // state.nodes.map(n => n.id === change.id ? {...n, ...change} : n); -- mas isso requer cuidado com os tipos
        return acc; // Por padrão, não faz nada se não for 'remove' ou 'position' tratado
      }, [...state.nodes]); // Começa com uma cópia dos nós atuais
      
      // Se nenhum nó foi removido ou movido pelos types tratados acima,
      // podemos precisar de uma lógica mais genérica para aplicar outras mudanças,
      // ou confiar que o onNodeDragStop/onDelete fará o trabalho principal.
      // Por enquanto, vamos focar em atualizar posições explicitamente via onNodeDragStop.
      // E remoções via deleteCard/deleteSchema.
      // A implementação mais robusta seria usar applyNodeChanges(changes, currentNodes).
      // Esta simplificação é para evitar adicionar applyNodeChanges diretamente na store sem
      // um entendimento completo de como o Zustand reage a ele.
      
      // Solução temporária para `applyNodeChanges` (precisa de `import { applyNodeChanges } from 'reactflow';`)
      // const updatedNodes = applyNodeChanges(changes, state.nodes);
      // For now, only handle position changes via onNodeDragStop and deletions via explicit delete functions.
      // Selections are handled by React Flow internally and don't need to be in this store unless specifically required.
      return { ...state /* nodes: updatedNodes */ };
    });
  },
  
  onEdgesChange: (changes) => {
    set((state) => {
      // Similar a onNodesChange, a maneira mais robusta é usar applyEdgeChanges.
      // import { applyEdgeChanges } from 'reactflow';
      // const updatedEdges = applyEdgeChanges(changes, state.edges);
      // return { edges: updatedEdges };

      // Implementação simplificada para deleção:
      const newEdges = changes.reduce((acc, change) => {
        if (change.type === 'remove') {
          return acc.filter(edge => edge.id !== change.id);
        }
        // Outros tipos de 'EdgeChange' podem ser tratados aqui se necessário
        return acc;
      }, [...state.edges]);
      return { edges: newEdges };
    });
  },
  addEdge: (edge) => {
    set((state) => ({ edges: [...state.edges, { ...edge, id: edge.id || nanoid() }] }));
    get().closeLabelEdgeModal(); // Fecha o modal após adicionar
  },
  updateEdgeLabel: (edgeId, labelData) => {
    set((state) => ({
      edges: state.edges.map(edge => edge.id === edgeId ? {...edge, data: labelData, label: labelData.label, ariaLabel: labelData.label } : edge)
    }))
  },
  removeEdge: (edgeId) => {
    set((state) => ({ edges: state.edges.filter(e => e.id !== edgeId) }));
  },
  setViewport: (viewport) => set({ viewport }),

  // --- Controle de Modais ---
  openABCForm: (cardId) => set({ isABCFormOpen: true, editingCardId: cardId || null }),
  closeABCForm: () => set({ isABCFormOpen: false, editingCardId: null }),
  openLabelEdgeModal: (edge) => set({ isLabelEdgeModalOpen: true, pendingEdge: edge }),
  closeLabelEdgeModal: () => set({ isLabelEdgeModalOpen: false, pendingEdge: null }),

  // --- Simulação de Fetch/Save ---
  fetchClinicalData: async (patientId) => {
    console.log(`Fetching data for patient ${patientId}... (Simulated)`);
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data - Em uma app real, isso viria de um backend/DB
    const mockCards: ABCCardData[] = [
      { id: 'c1', title: 'Ansiedade Social Evento X', antecedent: { external: 'Convite para festa', internal: 'Medo de julgamento', emotionIntensity: 80, thoughtBelief: 90 }, behavior: 'Recusar convite', consequence: { shortTermGain: 'Alívio imediato da ansiedade', shortTermCost: 'Perda da oportunidade social', longTermValueCost: 'Isolamento, reforço da crença de inadequação' }, tags: ['ansiedade social', 'evitação'], color: 'red', position: { x: 50, y: 50 } },
      { id: 'c2', title: 'Conflito no Trabalho', antecedent: { external: 'Feedback negativo do chefe', internal: 'Raiva, frustração', emotionIntensity: 70 }, behavior: 'Responder rispidamente', consequence: { shortTermGain: 'Desabafo momentâneo', shortTermCost: 'Piora do clima, possível retaliação', longTermValueCost: 'Prejuízo na carreira, stress contínuo' }, tags: ['trabalho', 'conflito', 'raiva'], color: 'default', position: {x: 300, y: 100}}
    ];
    const mockSchemas: SchemaData[] = [
      { id: 's1', rule: 'Se eu for a lugares com muita gente, serei julgado(a) negativamente.', linkedCardIds: ['c1'], position: {x: 100, y: 300}},
      { id: 's2', rule: 'Não sou bom o suficiente para este trabalho.', linkedCardIds: ['c2'], position: {x: 350, y: 350}}
    ];
    const mockEdges: Edge<ConnectionLabel | undefined>[] = [
      { id: 'e1-s1-c1', source: 's1', target: 'c1', type: 'smoothstep', data: {id:nanoid(), label: 'reforça'}, label: 'reforça'},
    ];

    const nodes: Node<ClinicalNodeData>[] = [
      ...mockCards.map(card => ({ id: card.id, type: 'abcCard' as ClinicalNodeType, position: card.position || { x: 0, y: 0 }, data: card, draggable: true })),
      ...mockSchemas.map(schema => ({ id: schema.id, type: 'schemaNode' as ClinicalNodeType, position: schema.position || { x: 0, y: 0 }, data: schema, draggable: true }))
    ];
    
    set({ cards: mockCards, schemas: mockSchemas, nodes, edges: mockEdges, insights: ['Dados carregados do paciente X (simulado).'] });
  },
  saveClinicalData: async (patientId) => {
    const { cards, schemas, insights, edges, viewport } = get();
    console.log(`Saving data for patient ${patientId}: (Simulated)`, {
      patientId,
      cards,
      schemas,
      insights,
      edges,
      viewport,
      savedAt: new Date().toISOString()
    });
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // Em uma app real, aqui seria a chamada para API de backend
    // Ex: await api.savePatientFormulation(patientId, { cards, schemas, insights, edges, viewport });
    get().addInsight(`Estudo salvo com sucesso em ${new Date().toLocaleTimeString()}. (Simulado)`);
  },

}));

export default useClinicalStore;

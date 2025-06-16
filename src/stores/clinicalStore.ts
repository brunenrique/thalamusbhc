
import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { Edge, Node, OnNodesChange, OnEdgesChange, Viewport, Connection, NodeMouseEvent } from 'reactflow';
import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import type {
  ABCCardData,
  SchemaData,
  ABCTemplate,
  ConnectionLabel,
  ClinicalNodeData,
  ClinicalNodeType,
  ABCCardColor
} from '@/types/clinicalTypes';
import { isABCCardData, isSchemaData } from '@/types/clinicalTypes';


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
  edges: Edge<ConnectionLabel | undefined>[]; 

  isABCFormOpen: boolean;
  editingCardId: string | null; 
  isSchemaFormOpen: boolean; // Novo
  editingSchemaId: string | null; // Novo
  isLabelEdgeModalOpen: boolean;
  pendingEdge: Edge<ConnectionLabel | undefined> | Connection | null;
  viewport: Viewport;

  // Context Menu State
  isContextMenuOpen: boolean;
  contextMenuPosition: { x: number; y: number } | null;
  contextMenuNodeId: string | null;
  contextMenuNodeType: ClinicalNodeType | null;


  // Ações para cards
  addCard: (data: Omit<ABCCardData, 'id' | 'position'>) => void;
  updateCard: (cardId: string, updates: Partial<Omit<ABCCardData, 'id' | 'position'>>) => void;
  deleteCard: (cardId: string) => void;
  changeCardColor: (cardId: string, color: ABCCardColor) => void;
  updateCardPosition: (cardId: string, position: { x: number; y: number }) => void;


  // Ações para schemas
  addSchema: (data: Omit<SchemaData, 'id' | 'linkedCardIds' | 'position'>) => void;
  updateSchema: (schemaId: string, updates: Partial<Omit<SchemaData, 'id' | 'position' | 'linkedCardIds'>>) => void;
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
  openSchemaForm: (schemaId?: string) => void; // Novo
  closeSchemaForm: () => void; // Novo
  openLabelEdgeModal: (edge: Edge<ConnectionLabel | undefined> | Connection) => void;
  closeLabelEdgeModal: () => void;
  openContextMenu: (nodeId: string, nodeType: ClinicalNodeType, position: { x: number; y: number }) => void;
  closeContextMenu: () => void;

  // Simulação de fetch
  fetchClinicalData: (patientId: string) => Promise<void>;
  saveClinicalData: (patientId: string) => Promise<void>;
}


const useClinicalStore = create<ClinicalState>((set, get) => ({
  // Estado inicial
  cards: [],
  schemas: [],
  templates: initialTemplates,
  insights: ["Clique em 'Gerar Insights' para análise."], 
  nodes: [],
  edges: [],
  isABCFormOpen: false,
  editingCardId: null,
  isSchemaFormOpen: false, // Novo
  editingSchemaId: null, // Novo
  isLabelEdgeModalOpen: false,
  pendingEdge: null,
  viewport: { x: 0, y: 0, zoom: 1 },

  isContextMenuOpen: false,
  contextMenuPosition: null,
  contextMenuNodeId: null,
  contextMenuNodeType: null,

  // --- Ações para Cards ---
  addCard: (data) => {
    const newCard: ABCCardData = { 
      ...data, 
      id: nanoid(),
      position: { x: Math.random() * 400 + 50, y: Math.random() * 400 + 50 } 
    };
    set((state) => {
      const newNode: Node<ABCCardData> = { 
        id: newCard.id, 
        type: 'abcCard' as ClinicalNodeType, 
        position: newCard.position!, 
        data: newCard, 
        draggable: true 
      };
      return { 
        cards: [...state.cards, newCard], 
        nodes: [...state.nodes, newNode as Node<ClinicalNodeData>] 
      };
    });
  },
  updateCard: (cardId, updates) =>
    set((state) => {
      const updatedCards = state.cards.map((card) =>
        card.id === cardId ? { ...card, ...updates, id: card.id } : card
      );
      const updatedNodes = state.nodes.map((node) =>
        node.id === cardId && node.type === 'abcCard' && isABCCardData(node.data) ? { ...node, data: updatedCards.find(c => c.id === cardId) as ABCCardData } : node
      );
      return { cards: updatedCards, nodes: updatedNodes };
    }),
  deleteCard: (cardId) =>
    set((state) => {
      const updatedSchemas = state.schemas.map(schema => ({
        ...schema,
        linkedCardIds: schema.linkedCardIds.filter(id => id !== cardId)
      }));
      const updatedSchemaNodes = state.nodes
        .filter(node => node.type === 'schemaNode')
        .map(node => {
            const schemaData = updatedSchemas.find(s => s.id === node.id);
            return schemaData && isSchemaData(node.data) ? {...node, data: schemaData as SchemaData } : node;
        });

      return {
        cards: state.cards.filter((card) => card.id !== cardId),
        schemas: updatedSchemas,
        nodes: state.nodes.filter((node) => node.id !== cardId)
                        .map(node => updatedSchemaNodes.find(usn => usn.id === node.id) || node),
        edges: state.edges.filter((edge) => edge.source !== cardId && edge.target !== cardId),
      };
    }),
  changeCardColor: (cardId, color) => {
    get().updateCard(cardId, { color });
  },
  updateCardPosition: (cardId, position) => 
    set(state => ({
      nodes: state.nodes.map(node => (node.id === cardId && node.type === 'abcCard') ? {...node, position} : node),
      cards: state.cards.map(card => card.id === cardId ? {...card, position} : card)
    })),

  // --- Ações para Schemas ---
  addSchema: (data) => {
    const newSchema: SchemaData = { 
      ...data, 
      id: nanoid(), 
      linkedCardIds: [],
      position: { x: Math.random() * 400 + 50, y: Math.random() * 200 + 450 } 
    };
    set((state) => {
      const newNode: Node<SchemaData> = { 
        id: newSchema.id, 
        type: 'schemaNode' as ClinicalNodeType, 
        position: newSchema.position!, 
        data: newSchema, 
        draggable: true 
      };
      return { 
        schemas: [...state.schemas, newSchema], 
        nodes: [...state.nodes, newNode as Node<ClinicalNodeData>] 
      };
    });
  },
  updateSchema: (schemaId, updates) => 
    set((state) => {
      const updatedSchemas = state.schemas.map((schema) =>
        schema.id === schemaId ? { ...schema, ...updates, id: schema.id, linkedCardIds: schema.linkedCardIds } : schema // Preserve linkedCardIds if not in updates
      );
      const finalUpdatedSchemas = state.schemas.map((schema) =>
        schema.id === schemaId ? { ...schema, ...updates, id: schema.id } : schema
      );

      const updatedNodes = state.nodes.map((node) => {
        if (node.id === schemaId && node.type === 'schemaNode' && isSchemaData(node.data)) {
          const correspondingSchema = finalUpdatedSchemas.find(s => s.id === schemaId);
          if (correspondingSchema) {
             return { ...node, data: { ...node.data, ...correspondingSchema } };
          }
        }
        return node;
      });
      return { schemas: finalUpdatedSchemas, nodes: updatedNodes };
    }),
  deleteSchema: (schemaId) =>
    set((state) => ({
      schemas: state.schemas.filter((schema) => schema.id !== schemaId),
      nodes: state.nodes.filter((node) => node.id !== schemaId),
      edges: state.edges.filter((edge) => edge.source !== schemaId && edge.target !== schemaId),
    })),
  linkCardToSchema: (schemaId, cardId) => {
    set((state) => {
      const targetSchema = state.schemas.find(s => s.id === schemaId);
      if (targetSchema && !targetSchema.linkedCardIds.includes(cardId)) {
        const updatedSchemaData = { ...targetSchema, linkedCardIds: [...targetSchema.linkedCardIds, cardId] };
        // Directly call updateSchema which handles node update
        get().updateSchema(schemaId, { linkedCardIds: updatedSchemaData.linkedCardIds });
      }
      return {}; // No direct state change here, updateSchema handles it
    });
  },
  unlinkCardFromSchema: (schemaId, cardId) => {
     set((state) => {
      const targetSchema = state.schemas.find(s => s.id === schemaId);
      if (targetSchema && targetSchema.linkedCardIds.includes(cardId)) {
        const updatedSchemaData = { ...targetSchema, linkedCardIds: targetSchema.linkedCardIds.filter(id => id !== cardId) };
         // Directly call updateSchema which handles node update
        get().updateSchema(schemaId, { linkedCardIds: updatedSchemaData.linkedCardIds });
      }
      return {}; // No direct state change here, updateSchema handles it
    });
  },
  updateSchemaPosition: (schemaId, position) =>
    set(state => ({
      nodes: state.nodes.map(node => (node.id === schemaId && node.type === 'schemaNode') ? {...node, position} : node),
      schemas: state.schemas.map(schema => schema.id === schemaId ? {...schema, position} : schema)
    })),

  // --- Ações para Insights ---
  setInsights: (insights) => set({ insights }),
  addInsight: (insight) => set(state => ({ insights: [...state.insights, insight] })),

  // --- Ações para React Flow ---
  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }));
    
    changes.forEach(change => {
        if (change.type === 'position' && typeof change.dragging === 'boolean' && !change.dragging && change.positionAbsolute) {
            const node = get().nodes.find(n => n.id === change.id);
            if (node) {
                if (node.type === 'abcCard') {
                    get().updateCardPosition(node.id, change.positionAbsolute);
                } else if (node.type === 'schemaNode') {
                    get().updateSchemaPosition(node.id, change.positionAbsolute);
                }
            }
        } else if (change.type === 'remove') {
            const nodeToRemove = get().nodes.find(n => n.id === change.id); // Find before applyNodeChanges removes it internally
            if (nodeToRemove) {
              if (nodeToRemove.type === 'abcCard') {
                get().deleteCard(change.id);
              } else if (nodeToRemove.type === 'schemaNode') {
                get().deleteSchema(change.id);
              }
            }
        }
    });
  },
  
  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
    changes.forEach(change => {
        if (change.type === 'remove') {
            get().removeEdge(change.id);
        }
    });
  },
  addEdge: (edge) => {
    set((state) => ({ edges: [...state.edges, { ...edge, id: edge.id || nanoid() }] }));
    get().closeLabelEdgeModal(); 
  },
  updateEdgeLabel: (edgeId, labelData) => {
    set((state) => ({
      edges: state.edges.map(edge => edge.id === edgeId ? {...edge, data: labelData, label: labelData.label, ariaLabel: labelData.label } : edge)
    }));
    get().closeLabelEdgeModal(); 
  },
  removeEdge: (edgeId) => {
    set((state) => ({ edges: state.edges.filter(e => e.id !== edgeId) }));
  },
  setViewport: (viewport) => set({ viewport }),

  // --- Controle de Modais ---
  openABCForm: (cardId) => set({ isABCFormOpen: true, editingCardId: cardId || null }),
  closeABCForm: () => set({ isABCFormOpen: false, editingCardId: null, pendingEdge: null }),
  openSchemaForm: (schemaId) => set({ isSchemaFormOpen: true, editingSchemaId: schemaId || null }), // Novo
  closeSchemaForm: () => set({ isSchemaFormOpen: false, editingSchemaId: null }), // Novo
  openLabelEdgeModal: (edgeParams) => set({ isLabelEdgeModalOpen: true, pendingEdge: edgeParams }),
  closeLabelEdgeModal: () => set({ isLabelEdgeModalOpen: false, pendingEdge: null }),
  openContextMenu: (nodeId, nodeType, position) => set({
    isContextMenuOpen: true,
    contextMenuNodeId: nodeId,
    contextMenuNodeType: nodeType,
    contextMenuPosition: position,
  }),
  closeContextMenu: () => set({
    isContextMenuOpen: false,
  }),

  // --- Simulação de Fetch/Save ---
  fetchClinicalData: async (patientId) => {
    console.info(`Fetching data for patient ${patientId}... (Simulated)`);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockCardsData: Omit<ABCCardData, 'id' | 'position'>[] = [
      { title: 'Ansiedade Social em Evento X', antecedent: { external: 'Convite para festa importante na empresa.', internal: 'Pensamentos: "Vou fazer papel de bobo", "Ninguém vai querer conversar comigo". Sentimento: Medo (80%), Vergonha (70%). Sensação: Coração acelerado, mãos suando.', emotionIntensity: 80, thoughtBelief: 90 }, behavior: 'Inventou uma desculpa e não foi ao evento.', consequence: { shortTermGain: 'Alívio imediato da ansiedade, evitação do desconforto.', shortTermCost: 'Perdeu oportunidade de networking e integração com colegas.', longTermValueCost: 'Reforçou a crença de inadequação social, isolamento progressivo, desalinhamento com valor de "conexão".' }, tags: ['ansiedade social', 'evitação', 'fobia social'], color: 'red' },
      { title: 'Conflito com Chefe', antecedent: { external: 'Feedback percebido como injusto do supervisor sobre um projeto.', internal: 'Pensamentos: "Ele não reconhece meu esforço", "Isso é injusto!". Sentimento: Raiva (85%), Frustração (75%).', emotionIntensity: 85 }, behavior: 'Respondeu de forma ríspida e defensiva, levantando a voz.', consequence: { shortTermGain: 'Expressou a raiva momentaneamente, sentiu-se "ouvido" (mesmo que negativamente).', shortTermCost: 'Clima ficou tenso, chefe ficou mais irritado, possível retaliação futura.', longTermValueCost: 'Prejudicou a relação profissional, aumentou o estresse no trabalho, desalinhado com valor de "profissionalismo".' }, tags: ['trabalho', 'conflito', 'raiva', 'comunicação'], color: 'default'}
    ];
    const mockSchemasData: Omit<SchemaData, 'id' | 'linkedCardIds' | 'position'>[] = [
      { rule: 'Se eu me expor socialmente, serei julgado(a) e rejeitado(a).', notes: 'Origem provável em experiências de bullying na adolescência.'},
      { rule: 'Preciso ser perfeito(a) em tudo que faço para ser valorizado(a).', notes: 'Relacionado a alta autocrítica e medo de falha.'}
    ];
    
    const cards: ABCCardData[] = mockCardsData.map((data, i) => ({...data, id: `c${i+1}`, position: { x: 100 + i * 350, y: 100 }}));
    const schemas: SchemaData[] = mockSchemasData.map((data, i) => ({...data, id: `s${i+1}`, linkedCardIds: [], position: { x: 150 + i * 350, y: 450 }}));
    
    if (schemas[0] && cards[0]) schemas[0].linkedCardIds.push(cards[0].id);
    if (schemas[1] && cards[1]) schemas[1].linkedCardIds.push(cards[1].id);


    const nodes: Node<ClinicalNodeData>[] = [
      ...cards.map(card => ({ id: card.id, type: 'abcCard' as ClinicalNodeType, position: card.position!, data: card, draggable: true })),
      ...schemas.map(schema => ({ id: schema.id, type: 'schemaNode' as ClinicalNodeType, position: schema.position!, data: schema, draggable: true }))
    ];

    const edges: Edge<ConnectionLabel | undefined>[] = [];
    if (schemas[0] && cards[0]) {
        const edgeId = `e-${schemas[0].id}-${cards[0].id}`;
        const labelData: ConnectionLabel = { id: nanoid(), label: 'reforça' };
        edges.push({ id: edgeId, source: schemas[0].id, target: cards[0].id, type: 'smoothstep', data: labelData, label: labelData.label, animated: true });
    }
    
    set({ cards, schemas, nodes, edges, insights: ["Clique em 'Gerar Insights' para análise."] });
  },
  saveClinicalData: async (patientId) => {
    const { cards, schemas, insights, edges, viewport, nodes } = get();
    
    const finalCards = cards.map(card => {
        const node = nodes.find(n => n.id === card.id && n.type === 'abcCard');
        return node && node.position ? { ...card, position: node.position } : card;
    });
    const finalSchemas = schemas.map(schema => {
        const node = nodes.find(n => n.id === schema.id && n.type === 'schemaNode');
        return node && node.position ? { ...schema, position: node.position } : schema;
    });

    console.info(`Saving data for patient ${patientId}: (Simulated)`, {
      patientId,
      cards: finalCards,
      schemas: finalSchemas,
      insights,
      edges,
      viewport,
      savedAt: new Date().toISOString()
    });
    await new Promise(resolve => setTimeout(resolve, 300));
    get().addInsight(`Estudo salvo com sucesso em ${new Date().toLocaleTimeString()}. (Simulado)`);
  },

}));

export default useClinicalStore;

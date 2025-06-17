
import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { Edge, Node, OnNodesChange, OnEdgesChange, Viewport, Connection } from 'reactflow';
import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import type {
  ABCCardData,
  SchemaData,
  ABCTemplate,
  ConnectionLabel,
  ClinicalNodeData,
  ClinicalNodeType,
  ABCCardColor,
  FormulationGuideQuestion,
  QuickNote,
  CardGroup,
  CardGroupInfo,
} from '@/types/clinicalTypes';
import { isABCCardData, isSchemaData } from '@/types/clinicalTypes';

// Mock inicial para templates
const initialTemplates: ABCTemplate[] = [
  { id: nanoid(), name: 'Ataque de Pânico', antecedentGuide: 'O que estava acontecendo externa e internamente antes do pânico? (Ex: multidão, pensamento "vou passar mal")', behaviorGuide: 'Qual foi a principal resposta comportamental ao pânico? (Ex: fugir do local, verificar sensações corporais)', consequenceGuide: 'O que aconteceu imediatamente após (alívio, evitação confirmada)? E a longo prazo (perda de oportunidades, reforço da ansiedade)?' },
  { id: nanoid(), name: 'Procrastinação', antecedentGuide: 'Qual tarefa estava pendente? Que pensamentos/sentimentos surgiram? (Ex: tarefa difícil, medo de falhar)', behaviorGuide: 'Qual comportamento foi realizado em vez da tarefa? (Ex: redes sociais, organizar a mesa)', consequenceGuide: 'Qual foi o alívio imediato? Quais foram os custos de curto e longo prazo (Ex: tarefa acumulada, estresse, culpa)?' },
  { id: nanoid(), name: 'Discussão Conjugal', antecedentGuide: 'Qual foi o gatilho da discussão? O que cada um estava pensando/sentindo? (Ex: crítica percebida, cansaço)', behaviorGuide: 'Como cada um se comportou durante a discussão? (Ex: gritar, silenciar, acusar)', consequenceGuide: 'Qual foi o resultado imediato (Ex: afastamento, "vitória" momentânea)? E o impacto no relacionamento a longo prazo (Ex: desgaste, falta de resolução)?' },
];

const initialFormulationGuideQuestions: FormulationGuideQuestion[] = [
  { id: 'fgq1', text: 'Que função clínica esse comportamento (B) cumpre para o paciente?' },
  { id: 'fgq2', text: 'Este comportamento (B) é reforçado positiva ou negativamente no curto prazo (C)? Como?' },
  { id: 'fgq3', text: 'O comportamento (B) está alinhado ou desalinhado com quais valores ou objetivos de longo prazo (C) do paciente?' },
  { id: 'fgq4', text: 'Quais pensamentos, emoções ou sensações (A - interno) o paciente parece estar tentando evitar ou controlar com o comportamento (B)?' },
  { id: 'fgq5', text: 'Este padrão de Antecedente-Comportamento-Consequência (ABC) se repete em outros contextos da vida do paciente? Quais?' },
  { id: 'fgq6', text: 'Qual esquema ou crença central (Schema) parece estar sendo ativado no Antecedente (A) e/ou mantido pela Consequência (C)?' },
  { id: 'fgq7', text: 'Que habilidades alternativas ou comportamentos mais funcionais poderiam ser desenvolvidos ou fortalecidos?' },
];


const allCardColors: ABCCardColor[] = ['default', 'red', 'green', 'blue', 'yellow', 'purple'];

export interface ClinicalState {
  cards: ABCCardData[];
  schemas: SchemaData[];
  templates: ABCTemplate[];
  insights: string[];
  formulationGuideQuestions: FormulationGuideQuestion[];
  formulationGuideAnswers: Record<string, boolean>; // { questionId: answered }
  quickNotes: QuickNote[];
  cardGroups: CardGroup[];

  nodes: Node<ClinicalNodeData>[];
  edges: Edge<ConnectionLabel | undefined>[];

  isABCFormOpen: boolean;
  editingCardId: string | null;
  isSchemaFormOpen: boolean;
  editingSchemaId: string | null;
  prefillSchemaRule: string | null;
  isLabelEdgeModalOpen: boolean;
  pendingEdge: Edge<ConnectionLabel | undefined> | Connection | null;
  viewport: Viewport;

  isContextMenuOpen: boolean;
  contextMenuPosition: { x: number; y: number } | null;
  contextMenuNodeId: string | null;
  contextMenuNodeType: ClinicalNodeType | null;

  activeColorFilters: ABCCardColor[];
  showSchemaNodes: boolean;
  isSchemaPanelVisible: boolean;
  isFormulationGuidePanelVisible: boolean;
  isQuickNotesPanelVisible: boolean;
  emotionIntensityFilter: number;
  toolbarOrientation: 'horizontal' | 'vertical'; // Novo estado

  isQuickNoteFormOpen: boolean;
  quickNoteFormTarget: { cardId?: string; defaultText?: string; noteIdToEdit?: string } | null;
  selectedFlowNodes?: Node[]; // Para rastrear nós selecionados no React Flow


  addCard: (data: Omit<ABCCardData, 'id' | 'position' | 'groupInfo'>) => void;
  updateCard: (cardId: string, updates: Partial<Omit<ABCCardData, 'id' | 'position'>>) => void;
  deleteCard: (cardId: string) => void;
  changeCardColor: (cardId: string, color: ABCCardColor) => void;
  updateCardPosition: (cardId: string, position: { x: number; y: number }) => void;

  addSchema: (data: Omit<SchemaData, 'id' | 'linkedCardIds' | 'position'>) => void;
  updateSchema: (schemaId: string, updates: Partial<Omit<SchemaData, 'id' | 'position'>>) => void;
  deleteSchema: (schemaId: string) => void;
  linkCardToSchema: (schemaId: string, cardId: string) => void;
  unlinkCardFromSchema: (schemaId: string, cardId: string) => void;
  updateSchemaPosition: (schemaId: string, position: { x: number; y: number }) => void;

  setInsights: (insights: string[]) => void;
  addInsight: (insight: string) => void;

  toggleFormulationQuestionAnswer: (questionId: string) => void;

  addQuickNote: (noteData: Omit<QuickNote, 'id' | 'createdAt'>) => void;
  updateQuickNote: (noteId: string, updates: Partial<Omit<QuickNote, 'id' | 'createdAt'>>) => void;
  deleteQuickNote: (noteId: string) => void;
  openQuickNoteForm: (target?: { cardId?: string; defaultText?: string; noteIdToEdit?: string }) => void;
  closeQuickNoteForm: () => void;

  createGroupFromSelectedNodes: (groupName: string, groupColor: string, selectedCardIds: string[]) => void;
  assignCardToGroup: (cardId: string, groupInfo: CardGroupInfo | null) => void;
  removeCardFromItsGroup: (cardId: string) => void;
  deleteGroupAndUngroupCards: (groupId: string) => void;
  getCardGroups: () => CardGroup[];
  setSelectedFlowNodes: (nodes: Node[]) => void;


  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addEdge: (edge: Edge<ConnectionLabel | undefined>) => void;
  updateEdgeLabel: (edgeId: string, labelData: ConnectionLabel) => void;
  removeEdge: (edgeId: string) => void;
  setViewport: (viewport: Viewport) => void;

  openABCForm: (cardId?: string) => void;
  closeABCForm: () => void;
  openSchemaForm: (schemaId?: string, prefillRule?: string) => void;
  closeSchemaForm: () => void;
  openLabelEdgeModal: (edge: Edge<ConnectionLabel | undefined> | Connection) => void;
  closeLabelEdgeModal: () => void;
  openContextMenu: (nodeId: string, nodeType: ClinicalNodeType, position: { x: number; y: number }) => void;
  closeContextMenu: () => void;

  setColorFilters: (colors: ABCCardColor[]) => void;
  toggleShowSchemaNodes: () => void;
  toggleSchemaPanelVisibility: () => void;
  toggleFormulationGuidePanelVisibility: () => void;
  toggleQuickNotesPanelVisibility: () => void;
  setEmotionIntensityFilter: (intensity: number) => void;
  toggleToolbarOrientation: () => void; // Nova ação


  fetchClinicalData: (patientId: string) => Promise<void>;
  saveClinicalData: (patientId: string) => Promise<void>;
  get: () => ClinicalState;
}


const useClinicalStore = create<ClinicalState>((set, get) => ({
  cards: [],
  schemas: [],
  templates: initialTemplates,
  insights: ["Clique em 'Gerar Insights' para análise."],
  formulationGuideQuestions: initialFormulationGuideQuestions,
  formulationGuideAnswers: {},
  quickNotes: [],
  cardGroups: [],

  nodes: [],
  edges: [],
  isABCFormOpen: false,
  editingCardId: null,
  isSchemaFormOpen: false,
  editingSchemaId: null,
  prefillSchemaRule: null,
  isLabelEdgeModalOpen: false,
  pendingEdge: null,
  viewport: { x: 0, y: 0, zoom: 1 },

  isContextMenuOpen: false,
  contextMenuPosition: null,
  contextMenuNodeId: null,
  contextMenuNodeType: null,

  activeColorFilters: [...allCardColors],
  showSchemaNodes: true,
  isSchemaPanelVisible: false, 
  isFormulationGuidePanelVisible: false,
  isQuickNotesPanelVisible: false,
  emotionIntensityFilter: 0,
  toolbarOrientation: 'horizontal', // Valor padrão

  isQuickNoteFormOpen: false,
  quickNoteFormTarget: null,
  selectedFlowNodes: [],


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
        card.id === cardId ? { ...card, ...updates, id: card.id, position: card.position } : card
      );
      const updatedNodes = state.nodes.map((node) =>
        node.id === cardId && node.type === 'abcCard' && isABCCardData(node.data)
        ? { ...node, data: updatedCards.find(c => c.id === cardId) as ABCCardData }
        : node
      );
      return { cards: updatedCards, nodes: updatedNodes as Node<ClinicalNodeData>[] };
    }),
  deleteCard: (cardId) =>
    set((state) => {
      const updatedSchemas = state.schemas.map(schema => ({
        ...schema,
        linkedCardIds: schema.linkedCardIds.filter(id => id !== cardId)
      }));
       const updatedNodes = state.nodes.filter((node) => node.id !== cardId);
       const finalNodes = updatedNodes.map(node => {
        if (node.type === 'schemaNode' && isSchemaData(node.data)) {
            const matchingSchema = updatedSchemas.find(s => s.id === node.id);
            if (matchingSchema) {
                return { ...node, data: matchingSchema };
            }
        }
        return node;
       });

      return {
        cards: state.cards.filter((card) => card.id !== cardId),
        quickNotes: state.quickNotes.map(note => note.linkedCardId === cardId ? {...note, linkedCardId: undefined} : note),
        schemas: updatedSchemas,
        nodes: finalNodes as Node<ClinicalNodeData>[],
        edges: state.edges.filter((edge) => edge.source !== cardId && edge.target !== cardId),
      };
    }),
  changeCardColor: (cardId, color) => {
    get().updateCard(cardId, { color });
  },
  updateCardPosition: (cardId, position) =>
    set(state => ({
      nodes: state.nodes.map(node => (node.id === cardId && node.type === 'abcCard') ? {...node, position} : node) as Node<ClinicalNodeData>[],
      cards: state.cards.map(card => card.id === cardId ? {...card, position} : card)
    })),

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
        schema.id === schemaId ? { ...schema, ...updates, id: schema.id, position: schema.position, linkedCardIds: 'linkedCardIds' in updates && updates.linkedCardIds !== undefined ? updates.linkedCardIds : schema.linkedCardIds } : schema
      );
      const updatedNodes = state.nodes.map((node) => {
        if (node.id === schemaId && node.type === 'schemaNode' && isSchemaData(node.data)) {
          const correspondingSchema = updatedSchemas.find(s => s.id === schemaId);
          if (correspondingSchema) {
             return { ...node, data: { ...node.data, ...correspondingSchema } };
          }
        }
        return node;
      });
      return { schemas: updatedSchemas, nodes: updatedNodes as Node<ClinicalNodeData>[] };
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
        const newLinkedCardIds = [...targetSchema.linkedCardIds, cardId];
        const updatedSchemas = state.schemas.map(s =>
          s.id === schemaId ? { ...s, linkedCardIds: newLinkedCardIds } : s
        );
        const updatedNodes = state.nodes.map(n => {
          if (n.id === schemaId && n.type === 'schemaNode') {
            return { ...n, data: { ...n.data, linkedCardIds: newLinkedCardIds } as SchemaData };
          }
          return n;
        });
        return { schemas: updatedSchemas, nodes: updatedNodes as Node<ClinicalNodeData>[] };
      }
      return state;
    });
  },
  unlinkCardFromSchema: (schemaId, cardId) => {
     set((state) => {
      const targetSchema = state.schemas.find(s => s.id === schemaId);
      if (targetSchema && targetSchema.linkedCardIds.includes(cardId)) {
        const newLinkedCardIds = targetSchema.linkedCardIds.filter(id => id !== cardId);
        const updatedSchemas = state.schemas.map(s =>
          s.id === schemaId ? { ...s, linkedCardIds: newLinkedCardIds } : s
        );
        const updatedNodes = state.nodes.map(n => {
          if (n.id === schemaId && n.type === 'schemaNode') {
            return { ...n, data: { ...n.data, linkedCardIds: newLinkedCardIds } as SchemaData };
          }
          return n;
        });
        return { schemas: updatedSchemas, nodes: updatedNodes as Node<ClinicalNodeData>[] };
      }
      return state;
    });
  },
  updateSchemaPosition: (schemaId, position) =>
    set(state => ({
      nodes: state.nodes.map(node => (node.id === schemaId && node.type === 'schemaNode') ? {...node, position} : node) as Node<ClinicalNodeData>[],
      schemas: state.schemas.map(schema => schema.id === schemaId ? {...schema, position} : schema)
    })),

  setInsights: (insights) => set({ insights }),
  addInsight: (insight) => set(state => ({ insights: [...state.insights, insight] })),

  toggleFormulationQuestionAnswer: (questionId) =>
    set(state => ({
      formulationGuideAnswers: {
        ...state.formulationGuideAnswers,
        [questionId]: !state.formulationGuideAnswers[questionId],
      }
    })),

  addQuickNote: (noteData) => set(state => ({
    quickNotes: [...state.quickNotes, { ...noteData, id: nanoid(), createdAt: new Date().toISOString() }]
  })),
  updateQuickNote: (noteId, updates) => set(state => ({
    quickNotes: state.quickNotes.map(note => note.id === noteId ? { ...note, ...updates } : note)
  })),
  deleteQuickNote: (noteId) => set(state => ({
    quickNotes: state.quickNotes.filter(note => note.id !== noteId)
  })),
  openQuickNoteForm: (target) => set({ isQuickNoteFormOpen: true, quickNoteFormTarget: target || null }),
  closeQuickNoteForm: () => set({ isQuickNoteFormOpen: false, quickNoteFormTarget: null }),

  createGroupFromSelectedNodes: (groupName, groupColor, selectedCardIds) => {
    const newGroupId = nanoid();
    const newGroup: CardGroup = { id: newGroupId, name: groupName, color: groupColor };
    const groupInfo: CardGroupInfo = { id: newGroupId, name: groupName, color: groupColor };

    set(state => {
      const updatedCards = state.cards.map(card =>
        selectedCardIds.includes(card.id) ? { ...card, groupInfo } : card
      );
      const updatedNodes = state.nodes.map(node => {
        if (node.type === 'abcCard' && selectedCardIds.includes(node.id) && isABCCardData(node.data)) {
          return { ...node, data: { ...node.data, groupInfo } };
        }
        return node;
      });
      return {
        cardGroups: [...state.cardGroups, newGroup],
        cards: updatedCards,
        nodes: updatedNodes as Node<ClinicalNodeData>[],
      };
    });
  },
  assignCardToGroup: (cardId, groupInfo) => {
    get().updateCard(cardId, { groupInfo: groupInfo || undefined });
  },
  removeCardFromItsGroup: (cardId) => {
    get().updateCard(cardId, { groupInfo: undefined });
  },
  deleteGroupAndUngroupCards: (groupId) => {
    set(state => {
      const updatedCards = state.cards.map(card =>
        card.groupInfo?.id === groupId ? { ...card, groupInfo: undefined } : card
      );
      const updatedNodes = state.nodes.map(node => {
        if (node.type === 'abcCard' && isABCCardData(node.data) && node.data.groupInfo?.id === groupId) {
          return { ...node, data: { ...node.data, groupInfo: undefined } };
        }
        return node;
      });
      return {
        cardGroups: state.cardGroups.filter(group => group.id !== groupId),
        cards: updatedCards,
        nodes: updatedNodes as Node<ClinicalNodeData>[],
      };
    });
  },
  getCardGroups: () => get().cardGroups,
  setSelectedFlowNodes: (nodes) => set({ selectedFlowNodes: nodes }),


  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as Node<ClinicalNodeData>[],
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
            const nodeToDelete = get().nodes.find(n => n.id === change.id);
            if (nodeToDelete) {
                if (nodeToDelete.type === 'abcCard') {
                  get().deleteCard(change.id);
                } else if (nodeToDelete.type === 'schemaNode') {
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
      edges: state.edges.map(edge => edge.id === edgeId ? {...edge, data: labelData, label: labelData.label, ariaLabel: `Conexão: ${labelData.label}` } : edge)
    }));
    get().closeLabelEdgeModal();
  },
  removeEdge: (edgeId) => {
    set((state) => ({ edges: state.edges.filter(e => e.id !== edgeId) }));
  },
  setViewport: (viewport) => set({ viewport }),

  openABCForm: (cardId) => set({ isABCFormOpen: true, editingCardId: cardId || null }),
  closeABCForm: () => set({ isABCFormOpen: false, editingCardId: null, pendingEdge: null }),
  openSchemaForm: (schemaId, prefillRule) => {
    set({
      isSchemaFormOpen: true,
      editingSchemaId: schemaId || null,
      prefillSchemaRule: (!schemaId && prefillRule) ? prefillRule : null
    });
  },
  closeSchemaForm: () => set({ isSchemaFormOpen: false, editingSchemaId: null, prefillSchemaRule: null }),
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

  setColorFilters: (colors) => set({ activeColorFilters: colors }),
  toggleShowSchemaNodes: () => set(state => ({ showSchemaNodes: !state.showSchemaNodes })),
  toggleSchemaPanelVisibility: () => set(state => ({ isSchemaPanelVisible: !state.isSchemaPanelVisible })),
  toggleFormulationGuidePanelVisibility: () => set(state => ({ isFormulationGuidePanelVisible: !state.isFormulationGuidePanelVisible })),
  toggleQuickNotesPanelVisibility: () => set(state => ({ isQuickNotesPanelVisible: !state.isQuickNotesPanelVisible })),
  setEmotionIntensityFilter: (intensity: number) => set({ emotionIntensityFilter: intensity }),
  toggleToolbarOrientation: () => set(state => ({ toolbarOrientation: state.toolbarOrientation === 'horizontal' ? 'vertical' : 'horizontal' })),


  fetchClinicalData: async (patientId) => {
    
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockCardsData: Omit<ABCCardData, 'id' | 'position' | 'groupInfo'>[] = [
      { title: 'Ansiedade Social em Evento X', antecedent: { external: 'Convite para festa importante na empresa.', internal: 'Pensamentos: "Vou fazer papel de bobo", "Ninguém vai querer conversar comigo". Sentimento: Medo (80%), Vergonha (70%).', emotionIntensity: 80, thoughtBelief: 90 }, behavior: 'Inventou uma desculpa e não foi ao evento.', consequence: { shortTermGain: 'Alívio imediato da ansiedade, evitação do desconforto.', shortTermCost: 'Perdeu oportunidade de networking e integração com colegas.', longTermValueCost: 'Reforçou a crença de inadequação social, isolamento progressivo, desalinhamento com valor de "conexão".' }, tags: ['ansiedade social', 'evitação', 'fobia social'], color: 'red' },
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
        edges.push({ id: edgeId, source: schemas[0].id, target: cards[0].id, type: 'smoothstep', data: labelData, label: labelData.label, animated: true, ariaLabel: `Conexão: ${labelData.label}` });
    }

    
    set({
        cards,
        schemas,
        nodes,
        edges,
        insights: ["Clique em 'Gerar Insights' para análise."],
        activeColorFilters: [...allCardColors],
        showSchemaNodes: true,
        isSchemaPanelVisible: false, 
        isFormulationGuidePanelVisible: false,
        isQuickNotesPanelVisible: false,
        emotionIntensityFilter: 0,
        formulationGuideAnswers: initialFormulationGuideQuestions.reduce((acc, q) => ({...acc, [q.id]: false}), {}),
        quickNotes: [
            {id: nanoid(), text: "Paciente mencionou medo intenso de julgamento ao descrever o evento X.", createdAt: new Date(Date.now() - 86400000).toISOString(), linkedCardId: cards[0]?.id },
            {id: nanoid(), text: "Verificar se o esquema de 'inadequação' está ativo em situações de trabalho.", createdAt: new Date().toISOString(), title: "Hipótese de Esquema"}
        ],
        cardGroups: [],
    });
  },
  saveClinicalData: async (patientId) => {
    const { cards, schemas, insights, edges, viewport, nodes, formulationGuideAnswers, quickNotes, cardGroups } = get();

    const finalCards = cards.map(card => {
        const node = nodes.find(n => n.id === card.id && n.type === 'abcCard');
        return node && node.position ? { ...card, position: node.position } : card;
    });
    const finalSchemas = schemas.map(schema => {
        const node = nodes.find(n => n.id === schema.id && n.type === 'schemaNode');
        return node && node.position ? { ...schema, position: node.position } : schema;
    });

    
    await new Promise(resolve => setTimeout(resolve, 300));
    get().addInsight(`Estudo salvo com sucesso em ${new Date().toLocaleTimeString()}. (Simulado)`);
  },
  get,
}));

export default useClinicalStore;

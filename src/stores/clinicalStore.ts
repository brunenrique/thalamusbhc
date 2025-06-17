
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
  ClinicalTab, // Added
  ClinicalTabType, // Added
} from '@/types/clinicalTypes';
import { isABCCardData, isSchemaData } from '@/types/clinicalTypes';


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


export const allCardColors: ABCCardColor[] = ['default', 'red', 'green', 'blue', 'yellow', 'purple'];

interface TabSpecificFormulationData {
  cards: ABCCardData[];
  schemas: SchemaData[];
  nodes: Node<ClinicalNodeData>[];
  edges: Edge<ConnectionLabel | undefined>[];
  viewport: Viewport;
  insights: string[];
  formulationGuideAnswers: Record<string, boolean>;
  quickNotes: QuickNote[];
  cardGroups: CardGroup[];
  activeColorFilters: ABCCardColor[];
  showSchemaNodes: boolean;
  emotionIntensityFilter: number;
}

const getDefaultFormulationTabData = (): TabSpecificFormulationData => ({
  cards: [],
  schemas: [],
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  insights: ["Clique em 'Gerar Insights' para análise."],
  formulationGuideAnswers: initialFormulationGuideQuestions.reduce((acc, q) => {
    acc[q.id] = false;
    return acc;
  }, {} as Record<string, boolean>),
  quickNotes: [],
  cardGroups: [],
  activeColorFilters: [...allCardColors],
  showSchemaNodes: true,
  emotionIntensityFilter: 0,
});

export interface ClinicalState {
  tabs: ClinicalTab[];
  activeTabId: string | null;
  formulationTabData: Record<string, TabSpecificFormulationData>;
  // Future tab types can have their own data structures here:
  // chainAnalysisTabData: Record<string, ChainAnalysisSpecificData>;

  templates: ABCTemplate[];
  formulationGuideQuestions: FormulationGuideQuestion[]; // Global guide questions

  isABCFormOpen: boolean;
  editingCardId: string | null;
  isSchemaFormOpen: boolean;
  editingSchemaId: string | null;
  prefillSchemaRule: string | null;
  isLabelEdgeModalOpen: boolean;
  pendingEdge: Edge<ConnectionLabel | undefined> | Connection | null;

  isContextMenuOpen: boolean;
  contextMenuPosition: { x: number; y: number } | null;
  contextMenuNodeId: string | null;
  contextMenuNodeType: ClinicalNodeType | null;

  toolbarOrientation: 'horizontal' | 'vertical';
  isSchemaPanelVisible: boolean;
  isFormulationGuidePanelVisible: boolean;
  isQuickNotesPanelVisible: boolean;

  isQuickNoteFormOpen: boolean;
  quickNoteFormTarget: { cardId?: string; defaultText?: string; noteIdToEdit?: string } | null;
  selectedFlowNodes?: Node[];

  // Tab Management Actions
  addTab: (type: ClinicalTabType, title?: string) => string;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  renameTab: (tabId: string, newTitle: string) => void;

  // Data actions (will operate on active tab's data)
  addCard: (data: Omit<ABCCardData, 'id' | 'position' | 'groupInfo' | 'tabId'>) => void;
  updateCard: (cardId: string, updates: Partial<Omit<ABCCardData, 'id' | 'position' | 'tabId'>>) => void;
  deleteCard: (cardId: string) => void;
  changeCardColor: (cardId: string, color: ABCCardColor) => void;
  updateCardPosition: (cardId: string, position: { x: number; y: number }) => void;

  addSchema: (data: Omit<SchemaData, 'id' | 'linkedCardIds' | 'position' | 'tabId'>) => void;
  updateSchema: (schemaId: string, updates: Partial<Omit<SchemaData, 'id' | 'position' | 'tabId'>>) => void;
  deleteSchema: (schemaId: string) => void;
  linkCardToSchema: (schemaId: string, cardId: string) => void;
  unlinkCardFromSchema: (schemaId: string, cardId: string) => void;
  updateSchemaPosition: (schemaId: string, position: { x: number; y: number }) => void;

  setInsights: (insights: string[]) => void;
  addInsight: (insight: string) => void;

  toggleFormulationQuestionAnswer: (questionId: string) => void;

  addQuickNote: (noteData: Omit<QuickNote, 'id' | 'createdAt' | 'tabId'>) => void;
  updateQuickNote: (noteId: string, updates: Partial<Omit<QuickNote, 'id' | 'createdAt' | 'tabId'>>) => void;
  deleteQuickNote: (noteId: string) => void;
  openQuickNoteForm: (target?: { cardId?: string; defaultText?: string; noteIdToEdit?: string }) => void;
  closeQuickNoteForm: () => void;

  createGroupFromSelectedNodes: (groupName: string, groupColor: string, selectedCardIds: string[]) => void;
  assignCardToGroup: (cardId: string, groupInfo: CardGroupInfo | null) => void;
  removeCardFromItsGroup: (cardId: string) => void;
  deleteGroupAndUngroupCards: (groupId: string) => void;
  getCardGroups: () => CardGroup[]; // Will need to be activeTab specific
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
  setAllColorFilters: (show: boolean) => void;
  toggleShowSchemaNodes: () => void;
  toggleSchemaPanelVisibility: () => void;
  toggleFormulationGuidePanelVisibility: () => void;
  toggleQuickNotesPanelVisibility: () => void;
  setEmotionIntensityFilter: (intensity: number) => void;
  toggleToolbarOrientation: () => void;
  
  fetchClinicalData: (patientId: string, tabId: string) => Promise<void>; // Now takes tabId
  saveClinicalData: (patientId: string, tabId: string) => Promise<void>; // Now takes tabId
  get: () => ClinicalState;
}

const createInitialTab = (type: ClinicalTabType = 'formulation', title?: string): ClinicalTab => {
  const id = nanoid();
  return {
    id,
    type,
    title: title || `Formulação ${id.substring(0, 4)}`,
    createdAt: new Date().toISOString(),
  };
};

const defaultInitialTab = createInitialTab();

const useClinicalStore = create<ClinicalState>((set, get) => ({
  tabs: [defaultInitialTab],
  activeTabId: defaultInitialTab.id,
  formulationTabData: {
    [defaultInitialTab.id]: getDefaultFormulationTabData(),
  },
  templates: initialTemplates,
  formulationGuideQuestions: initialFormulationGuideQuestions,

  isABCFormOpen: false,
  editingCardId: null,
  isSchemaFormOpen: false,
  editingSchemaId: null,
  prefillSchemaRule: null,
  isLabelEdgeModalOpen: false,
  pendingEdge: null,

  isContextMenuOpen: false,
  contextMenuPosition: null,
  contextMenuNodeId: null,
  contextMenuNodeType: null,

  toolbarOrientation: 'horizontal',
  isSchemaPanelVisible: false,
  isFormulationGuidePanelVisible: false,
  isQuickNotesPanelVisible: false,

  isQuickNoteFormOpen: false,
  quickNoteFormTarget: null,
  selectedFlowNodes: [],

  // Helper to get current active tab's data
  _getActiveTabData: () => {
    const { activeTabId, formulationTabData } = get();
    if (!activeTabId || !formulationTabData[activeTabId]) {
      // This case should ideally not happen if activeTabId always points to valid data
      // Or, we might need to initialize data for a newly activated tab if not present
      // For now, return a default or throw an error if critical
      console.warn(`No data found for activeTabId: ${activeTabId}. Returning default.`);
      return getDefaultFormulationTabData(); 
    }
    return formulationTabData[activeTabId];
  },
  _setActiveTabData: (data: TabSpecificFormulationData) => {
    const { activeTabId } = get();
    if (activeTabId) {
      set(state => ({
        formulationTabData: {
          ...state.formulationTabData,
          [activeTabId]: data,
        }
      }));
    }
  },

  addTab: (type, title) => {
    const newTab = createInitialTab(type, title || `${type.charAt(0).toUpperCase() + type.slice(1)} Nova`);
    set(state => ({
      tabs: [...state.tabs, newTab],
      activeTabId: newTab.id,
      formulationTabData: {
        ...state.formulationTabData,
        [newTab.id]: getDefaultFormulationTabData(), // Initialize data for the new tab
      },
    }));
    get().fetchClinicalData("mockPatientId", newTab.id); // Fetch/init data for new tab
    return newTab.id;
  },
  removeTab: (tabId) => {
    set(state => {
      const newTabs = state.tabs.filter(t => t.id !== tabId);
      const newFormulationTabData = { ...state.formulationTabData };
      delete newFormulationTabData[tabId];
      
      let newActiveTabId = state.activeTabId;
      if (state.activeTabId === tabId) {
        newActiveTabId = newTabs.length > 0 ? newTabs[0].id : null;
      }
      return {
        tabs: newTabs,
        formulationTabData: newFormulationTabData,
        activeTabId: newActiveTabId,
      };
    });
  },
  setActiveTab: (tabId) => {
    set({ activeTabId: tabId });
    // Potentially trigger data loading for this tab if not already loaded
    get().fetchClinicalData("mockPatientId", tabId);
  },
  renameTab: (tabId, newTitle) => {
    set(state => ({
      tabs: state.tabs.map(t => t.id === tabId ? { ...t, title: newTitle } : t),
    }));
  },

  addCard: (data) => {
    const activeTabId = get().activeTabId;
    if (!activeTabId) return;
    const activeTabData = get()._getActiveTabData();
    const newCard: ABCCardData = {
      ...data,
      id: nanoid(),
      tabId: activeTabId,
      position: { x: Math.random() * 400 + 50, y: Math.random() * 400 + 50 }
    };
    const newNode: Node<ABCCardData> = {
      id: newCard.id, type: 'abcCard', position: newCard.position!, data: newCard, draggable: true
    };
    get()._setActiveTabData({
      ...activeTabData,
      cards: [...activeTabData.cards, newCard],
      nodes: [...activeTabData.nodes, newNode as Node<ClinicalNodeData>],
    });
  },
  updateCard: (cardId, updates) => {
    const activeTabData = get()._getActiveTabData();
    const updatedCards = activeTabData.cards.map(c => c.id === cardId ? { ...c, ...updates } : c);
    const updatedNodes = activeTabData.nodes.map(n =>
      n.id === cardId && n.type === 'abcCard' && isABCCardData(n.data)
      ? { ...n, data: updatedCards.find(c => c.id === cardId)! }
      : n
    );
    get()._setActiveTabData({ ...activeTabData, cards: updatedCards, nodes: updatedNodes as Node<ClinicalNodeData>[] });
  },
  deleteCard: (cardId) => {
    const activeTabData = get()._getActiveTabData();
    const updatedSchemas = activeTabData.schemas.map(s => ({ ...s, linkedCardIds: s.linkedCardIds.filter(id => id !== cardId) }));
    const updatedNodes = activeTabData.nodes.filter(n => n.id !== cardId).map(n => {
        if (n.type === 'schemaNode' && isSchemaData(n.data)) {
            const matchingSchema = updatedSchemas.find(s => s.id === n.id);
            if (matchingSchema) return { ...n, data: matchingSchema };
        }
        return n;
    });
    get()._setActiveTabData({
      ...activeTabData,
      cards: activeTabData.cards.filter(c => c.id !== cardId),
      quickNotes: activeTabData.quickNotes.map(note => note.linkedCardId === cardId ? {...note, linkedCardId: undefined} : note),
      schemas: updatedSchemas,
      nodes: updatedNodes as Node<ClinicalNodeData>[],
      edges: activeTabData.edges.filter(e => e.source !== cardId && e.target !== cardId),
    });
  },
  changeCardColor: (cardId, color) => get().updateCard(cardId, { color }),
  updateCardPosition: (cardId, position) => {
    const activeTabData = get()._getActiveTabData();
    get()._setActiveTabData({
      ...activeTabData,
      nodes: activeTabData.nodes.map(n => (n.id === cardId && n.type === 'abcCard') ? {...n, position} : n) as Node<ClinicalNodeData>[],
      cards: activeTabData.cards.map(c => c.id === cardId ? {...c, position} : c)
    });
  },

  addSchema: (data) => {
    const activeTabId = get().activeTabId;
    if (!activeTabId) return;
    const activeTabData = get()._getActiveTabData();
    const newSchema: SchemaData = {
      ...data, id: nanoid(), tabId: activeTabId, linkedCardIds: [], position: { x: Math.random() * 400 + 50, y: Math.random() * 200 + 450 }
    };
    const newNode: Node<SchemaData> = {
      id: newSchema.id, type: 'schemaNode', position: newSchema.position!, data: newSchema, draggable: true
    };
    get()._setActiveTabData({
      ...activeTabData,
      schemas: [...activeTabData.schemas, newSchema],
      nodes: [...activeTabData.nodes, newNode as Node<ClinicalNodeData>],
    });
  },
  updateSchema: (schemaId, updates) => {
    const activeTabData = get()._getActiveTabData();
    const updatedSchemas = activeTabData.schemas.map(s => s.id === schemaId ? { ...s, ...updates } : s);
    const updatedNodes = activeTabData.nodes.map(n => {
      if (n.id === schemaId && n.type === 'schemaNode' && isSchemaData(n.data)) {
        const schema = updatedSchemas.find(s => s.id === schemaId);
        if (schema) return { ...n, data: { ...n.data, ...schema }};
      }
      return n;
    });
    get()._setActiveTabData({ ...activeTabData, schemas: updatedSchemas, nodes: updatedNodes as Node<ClinicalNodeData>[] });
  },
  deleteSchema: (schemaId) => {
    const activeTabData = get()._getActiveTabData();
    get()._setActiveTabData({
      ...activeTabData,
      schemas: activeTabData.schemas.filter(s => s.id !== schemaId),
      nodes: activeTabData.nodes.filter(n => n.id !== schemaId),
      edges: activeTabData.edges.filter(e => e.source !== schemaId && e.target !== schemaId),
    });
  },
  linkCardToSchema: (schemaId, cardId) => {
    const activeTabData = get()._getActiveTabData();
    const targetSchema = activeTabData.schemas.find(s => s.id === schemaId);
    if (targetSchema && !targetSchema.linkedCardIds.includes(cardId)) {
      const newLinkedCardIds = [...targetSchema.linkedCardIds, cardId];
      const updatedSchemas = activeTabData.schemas.map(s => s.id === schemaId ? { ...s, linkedCardIds: newLinkedCardIds } : s);
      const updatedNodes = activeTabData.nodes.map(n => (n.id === schemaId && n.type === 'schemaNode') ? { ...n, data: { ...n.data, linkedCardIds: newLinkedCardIds } as SchemaData } : n);
      get()._setActiveTabData({ ...activeTabData, schemas: updatedSchemas, nodes: updatedNodes as Node<ClinicalNodeData>[] });
    }
  },
  unlinkCardFromSchema: (schemaId, cardId) => {
    const activeTabData = get()._getActiveTabData();
    const targetSchema = activeTabData.schemas.find(s => s.id === schemaId);
    if (targetSchema && targetSchema.linkedCardIds.includes(cardId)) {
      const newLinkedCardIds = targetSchema.linkedCardIds.filter(id => id !== cardId);
      const updatedSchemas = activeTabData.schemas.map(s => s.id === schemaId ? { ...s, linkedCardIds: newLinkedCardIds } : s);
      const updatedNodes = activeTabData.nodes.map(n => (n.id === schemaId && n.type === 'schemaNode') ? { ...n, data: { ...n.data, linkedCardIds: newLinkedCardIds } as SchemaData } : n);
      get()._setActiveTabData({ ...activeTabData, schemas: updatedSchemas, nodes: updatedNodes as Node<ClinicalNodeData>[] });
    }
  },
  updateSchemaPosition: (schemaId, position) => {
    const activeTabData = get()._getActiveTabData();
    get()._setActiveTabData({
      ...activeTabData,
      nodes: activeTabData.nodes.map(n => (n.id === schemaId && n.type === 'schemaNode') ? {...n, position} : n) as Node<ClinicalNodeData>[],
      schemas: activeTabData.schemas.map(s => s.id === schemaId ? {...s, position} : s)
    });
  },

  setInsights: (insights) => {
    const activeTabData = get()._getActiveTabData();
    get()._setActiveTabData({ ...activeTabData, insights });
  },
  addInsight: (insight) => {
    const activeTabData = get()._getActiveTabData();
    get()._setActiveTabData({ ...activeTabData, insights: [...activeTabData.insights, insight] });
  },

  toggleFormulationQuestionAnswer: (questionId) => {
    const activeTabData = get()._getActiveTabData();
    get()._setActiveTabData({
      ...activeTabData,
      formulationGuideAnswers: {
        ...activeTabData.formulationGuideAnswers,
        [questionId]: !activeTabData.formulationGuideAnswers[questionId],
      }
    });
  },

  addQuickNote: (noteData) => {
    const activeTabId = get().activeTabId;
    if (!activeTabId) return;
    const activeTabData = get()._getActiveTabData();
    get()._setActiveTabData({
      ...activeTabData,
      quickNotes: [...activeTabData.quickNotes, { ...noteData, id: nanoid(), tabId: activeTabId, createdAt: new Date().toISOString() }]
    });
  },
  updateQuickNote: (noteId, updates) => {
    const activeTabData = get()._getActiveTabData();
    get()._setActiveTabData({
      ...activeTabData,
      quickNotes: activeTabData.quickNotes.map(note => note.id === noteId ? { ...note, ...updates } : note)
    });
  },
  deleteQuickNote: (noteId) => {
    const activeTabData = get()._getActiveTabData();
    get()._setActiveTabData({
      ...activeTabData,
      quickNotes: activeTabData.quickNotes.filter(note => note.id !== noteId)
    });
  },
  openQuickNoteForm: (target) => set({ isQuickNoteFormOpen: true, quickNoteFormTarget: target || null }),
  closeQuickNoteForm: () => set({ isQuickNoteFormOpen: false, quickNoteFormTarget: null }),

  createGroupFromSelectedNodes: (groupName, groupColor, selectedCardIds) => {
    const activeTabId = get().activeTabId;
    if (!activeTabId) return;
    const activeTabData = get()._getActiveTabData();
    const newGroupId = nanoid();
    const newGroup: CardGroup = { id: newGroupId, tabId: activeTabId, name: groupName, color: groupColor };
    const groupInfo: CardGroupInfo = { id: newGroupId, name: groupName, color: groupColor };
    
    const updatedCards = activeTabData.cards.map(card => selectedCardIds.includes(card.id) ? { ...card, groupInfo } : card );
    const updatedNodes = activeTabData.nodes.map(node => {
      if (node.type === 'abcCard' && selectedCardIds.includes(node.id) && isABCCardData(node.data)) {
        return { ...node, data: { ...node.data, groupInfo } };
      }
      return node;
    });
    get()._setActiveTabData({
      ...activeTabData,
      cardGroups: [...activeTabData.cardGroups, newGroup],
      cards: updatedCards,
      nodes: updatedNodes as Node<ClinicalNodeData>[],
    });
  },
  assignCardToGroup: (cardId, groupInfo) => get().updateCard(cardId, { groupInfo: groupInfo || undefined }),
  removeCardFromItsGroup: (cardId) => get().updateCard(cardId, { groupInfo: undefined }),
  deleteGroupAndUngroupCards: (groupId) => {
    const activeTabData = get()._getActiveTabData();
    const updatedCards = activeTabData.cards.map(card => card.groupInfo?.id === groupId ? { ...card, groupInfo: undefined } : card );
    const updatedNodes = activeTabData.nodes.map(node => {
      if (node.type === 'abcCard' && isABCCardData(node.data) && node.data.groupInfo?.id === groupId) {
        return { ...node, data: { ...node.data, groupInfo: undefined } };
      }
      return node;
    });
    get()._setActiveTabData({
      ...activeTabData,
      cardGroups: activeTabData.cardGroups.filter(group => group.id !== groupId),
      cards: updatedCards,
      nodes: updatedNodes as Node<ClinicalNodeData>[],
    });
  },
  getCardGroups: () => get()._getActiveTabData().cardGroups,
  setSelectedFlowNodes: (nodes) => set({ selectedFlowNodes: nodes }),

  onNodesChange: (changes) => {
    const activeTabData = get()._getActiveTabData();
    const updatedNodes = applyNodeChanges(changes, activeTabData.nodes) as Node<ClinicalNodeData>[];
    get()._setActiveTabData({ ...activeTabData, nodes: updatedNodes });

    changes.forEach(change => {
      if (change.type === 'position' && typeof change.dragging === 'boolean' && !change.dragging && change.positionAbsolute) {
        const node = updatedNodes.find(n => n.id === change.id);
        if (node) {
          if (node.type === 'abcCard') get().updateCardPosition(node.id, change.positionAbsolute);
          else if (node.type === 'schemaNode') get().updateSchemaPosition(node.id, change.positionAbsolute);
        }
      } else if (change.type === 'remove') {
        const nodeToDelete = activeTabData.nodes.find(n => n.id === change.id);
        if (nodeToDelete) {
          if (nodeToDelete.type === 'abcCard') get().deleteCard(change.id);
          else if (nodeToDelete.type === 'schemaNode') get().deleteSchema(change.id);
        }
      }
    });
  },
  onEdgesChange: (changes) => {
    const activeTabData = get()._getActiveTabData();
    const updatedEdges = applyEdgeChanges(changes, activeTabData.edges);
    get()._setActiveTabData({ ...activeTabData, edges: updatedEdges });
    changes.forEach(change => {
      if (change.type === 'remove') get().removeEdge(change.id);
    });
  },
  addEdge: (edge) => {
    const activeTabData = get()._getActiveTabData();
    get()._setActiveTabData({ ...activeTabData, edges: [...activeTabData.edges, { ...edge, id: edge.id || nanoid() }] });
    get().closeLabelEdgeModal();
  },
  updateEdgeLabel: (edgeId, labelData) => {
    const activeTabData = get()._getActiveTabData();
    get()._setActiveTabData({
      ...activeTabData,
      edges: activeTabData.edges.map(edge => edge.id === edgeId ? {...edge, data: labelData, label: labelData.label, ariaLabel: `Conexão: ${labelData.label}` } : edge)
    });
    get().closeLabelEdgeModal();
  },
  removeEdge: (edgeId) => {
    const activeTabData = get()._getActiveTabData();
    get()._setActiveTabData({ ...activeTabData, edges: activeTabData.edges.filter(e => e.id !== edgeId) });
  },
  setViewport: (viewport) => {
    const activeTabData = get()._getActiveTabData();
    get()._setActiveTabData({ ...activeTabData, viewport });
  },

  openABCForm: (cardId) => set({ isABCFormOpen: true, editingCardId: cardId || null }),
  closeABCForm: () => set({ isABCFormOpen: false, editingCardId: null, pendingEdge: null }),
  openSchemaForm: (schemaId, prefillRule) => set({ isSchemaFormOpen: true, editingSchemaId: schemaId || null, prefillSchemaRule: (!schemaId && prefillRule) ? prefillRule : null }),
  closeSchemaForm: () => set({ isSchemaFormOpen: false, editingSchemaId: null, prefillSchemaRule: null }),
  openLabelEdgeModal: (edgeParams) => set({ isLabelEdgeModalOpen: true, pendingEdge: edgeParams }),
  closeLabelEdgeModal: () => set({ isLabelEdgeModalOpen: false, pendingEdge: null }),
  openContextMenu: (nodeId, nodeType, position) => set({ isContextMenuOpen: true, contextMenuNodeId: nodeId, contextMenuNodeType: nodeType, contextMenuPosition: position }),
  closeContextMenu: () => set({ isContextMenuOpen: false }),

  setColorFilters: (colors) => {
    const activeTabData = get()._getActiveTabData();
    get()._setActiveTabData({ ...activeTabData, activeColorFilters: colors });
  },
  setAllColorFilters: (show) => {
    const activeTabData = get()._getActiveTabData();
    get()._setActiveTabData({ ...activeTabData, activeColorFilters: show ? [...allCardColors] : [] });
  },
  toggleShowSchemaNodes: () => {
    const activeTabData = get()._getActiveTabData();
    get()._setActiveTabData({ ...activeTabData, showSchemaNodes: !activeTabData.showSchemaNodes });
  },
  setEmotionIntensityFilter: (intensity) => {
    const activeTabData = get()._getActiveTabData();
    get()._setActiveTabData({ ...activeTabData, emotionIntensityFilter: intensity });
  },
  
  toggleToolbarOrientation: () => set(state => ({ toolbarOrientation: state.toolbarOrientation === 'horizontal' ? 'vertical' : 'horizontal' })),
  toggleSchemaPanelVisibility: () => set(state => ({ isSchemaPanelVisible: !state.isSchemaPanelVisible })),
  toggleFormulationGuidePanelVisibility: () => set(state => ({ isFormulationGuidePanelVisible: !state.isFormulationGuidePanelVisible })),
  toggleQuickNotesPanelVisibility: () => set(state => ({ isQuickNotesPanelVisible: !state.isQuickNotesPanelVisible })),
  
  fetchClinicalData: async (patientId, tabId) => {
    const existingTabData = get().formulationTabData[tabId];
    if (existingTabData) {
      // Data for this tab already exists/initialized, maybe refresh if needed
      // For now, we assume it's current or will be hydrated if this is first load
      return;
    }

    // If no data for tabId, initialize it
    set(state => ({
      formulationTabData: {
        ...state.formulationTabData,
        [tabId]: getDefaultFormulationTabData(), // Initialize with default empty data
      }
    }));

    // Simulate API call for specific tab data (currently initializes with mock)
    // This part could fetch from Firestore using patientId and tabId in a real app
    const activeTab = get().tabs.find(t => t.id === tabId);
    if (activeTab && activeTab.type === 'formulation') {
        // console.log(`Initializing/Fetching data for formulation tab: ${tabId} (Patient: ${patientId})`);
        // For demo, let's add some unique initial data if it's not the very first default tab
        if (tabId !== defaultInitialTab.id) {
            const specificTabData = getDefaultFormulationTabData();
            const cardTitle = `Card Inicial para ${activeTab.title}`;
            const newCard: ABCCardData = {
                id: nanoid(),
                tabId: tabId,
                title: cardTitle,
                antecedent: { external: 'Contexto específico desta aba.', internal: 'Pensamentos sobre esta aba.', emotionIntensity: 30, thoughtBelief: 60 },
                behavior: 'Explorando a funcionalidade da aba.',
                consequence: { shortTermGain: 'Aprendizado.', shortTermCost: 'Tempo.', longTermValueCost: 'Organização.' },
                tags: ['aba-específica', activeTab.title.toLowerCase().replace(/\s+/g, '-')],
                color: 'default',
                position: { x: 100, y: 100 }
            };
            specificTabData.cards = [newCard];
            specificTabData.nodes = [{ id: newCard.id, type: 'abcCard', position: newCard.position!, data: newCard, draggable: true } as Node<ClinicalNodeData>];
            get()._setActiveTabData(specificTabData); // Use _setActiveTabData to update the specific tab's data
        }
    }
  },
  saveClinicalData: async (patientId, tabId) => {
    const tabDataToSave = get().formulationTabData[tabId];
    if (!tabDataToSave) {
      console.warn(`No data to save for tabId: ${tabId}`);
      return;
    }

    const { cards, schemas, edges, viewport, insights, formulationGuideAnswers, quickNotes, cardGroups } = tabDataToSave;
    
    const finalCards = cards.map(card => {
      const node = tabDataToSave.nodes.find(n => n.id === card.id && n.type === 'abcCard');
      return node && node.position ? { ...card, position: node.position } : card;
    });
    const finalSchemas = schemas.map(schema => {
      const node = tabDataToSave.nodes.find(n => n.id === schema.id && n.type === 'schemaNode');
      return node && node.position ? { ...schema, position: node.position } : schema;
    });

    // console.log(`Saving data for patient: ${patientId}, Tab: ${tabId}`, {
    //   cards: finalCards,
    //   schemas: finalSchemas,
    //   edges,
    //   viewport,
    //   insights,
    //   formulationGuideAnswers,
    //   quickNotes,
    //   cardGroups,
    // });
    await new Promise(resolve => setTimeout(resolve, 300));
    get().addInsight(`Estudo da aba '${get().tabs.find(t => t.id === tabId)?.title || tabId}' salvo às ${new Date().toLocaleTimeString()}. (Simulado)`);
  },
  get,
}));

// Initialize data for the default active tab when the store is created
const initialActiveTabId = useClinicalStore.getState().activeTabId;
if (initialActiveTabId) {
  useClinicalStore.getState().fetchClinicalData("mockPatientId", initialActiveTabId);
}


export default useClinicalStore;

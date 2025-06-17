export interface BaseCard {
  id: string;
  type: string;
  title?: string;
  labels?: string[];
  archived?: boolean;
  [key: string]: any;
}

export interface ABCCard extends BaseCard {
  type: "abc";
  antecedent: string;
  behavior: string;
  consequence: string;
  sessionNumber?: number;
  sessionDate?: string;
}

export interface ChainAnalysisCard extends BaseCard {
  type: "chain";
  vulnerability: string;
  trigger: string;
  thought: string;
  emotion: { name: string; intensity: number };
  behavior: string;
  consequenceImmediate: string;
  consequenceLongTerm: string;
  interventionPoints: string[];
}

export interface ActMatrixCard extends BaseCard {
  type: "matrix";
  awayMoves: string[];
  towardMoves: string[];
  thoughts: string[];
  sensations: string[];
}

export interface Label {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

// ----- Additional types used by the clinical formulation features -----

/**
 * Defines the color variants available for ABC cards within the formulation
 * map. These map to Tailwind classes used throughout the UI.
 */
export type ABCCardColor =
  | 'default'
  | 'red'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'purple';

export interface CardGroupInfo {
  id: string;
  name: string;
  /** Tailwind border color class e.g. `border-red-500` */
  color: string;
}

export interface ABCCardData {
  id: string;
  title: string;
  antecedent: {
    external?: string;
    internal?: string;
    thoughtBelief?: number;
    emotionIntensity?: number;
  };
  behavior: string;
  consequence: {
    shortTermGain?: string;
    shortTermCost?: string;
    longTermValueCost?: string;
  };
  color: ABCCardColor;
  tags: string[];
  groupInfo?: CardGroupInfo;
}

export interface SchemaData {
  id: string;
  rule: string;
  notes?: string;
  linkedCardIds: string[];
  /** optional coordinates on the React Flow canvas */
  position?: { x: number; y: number };
  tabId?: string;
}

export interface ConnectionLabel {
  id: string;
  label: string;
}

export interface QuickNote {
  id: string;
  text: string;
  title?: string;
  createdAt: string;
  linkedCardId?: string;
}

export type ClinicalNodeType = 'abcCard' | 'schemaNode';

export type ClinicalNodeData = ABCCardData | SchemaData;

export interface FormulationGuideQuestion {
  id: string;
  text: string;
}

export interface TabSpecificFormulationData {
  cards: ABCCardData[];
  schemas: SchemaData[];
  nodes: Array<any>; // ReactFlow Node<ClinicalNodeData>
  edges: Array<any>; // ReactFlow Edge<ConnectionLabel | undefined>
  viewport: { x: number; y: number; zoom: number };
  insights: string[];
  formulationGuideAnswers: Record<string, boolean>;
  quickNotes: QuickNote[];
  cardGroups: CardGroupInfo[];
  activeColorFilters: ABCCardColor[];
  showSchemaNodes: boolean;
  emotionIntensityFilter: number;
}

export function isABCCardData(data: any): data is ABCCardData {
  return (
    data &&
    typeof data === 'object' &&
    'antecedent' in data &&
    'behavior' in data &&
    'consequence' in data
  );
}

export function isSchemaData(data: any): data is SchemaData {
  return (
    data &&
    typeof data === 'object' &&
    'rule' in data &&
    'linkedCardIds' in data
  );
}

export type ClinicalTabType =
  | 'formulation'
  | 'chain'
  | 'matrix'
  | 'hexaflex'
  | 'custom';

export interface ClinicalTab {
  id: string;
  type: ClinicalTabType;
  title: string;
}

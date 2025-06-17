
import type { XYPosition } from 'reactflow';

export interface BaseCard {
  id: string;
  type: string;
  title: string;
  sessionNumber?: number;
  sessionDate?: string; // Consider using ISO date string
  archived?: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ConnectionLabel {
  id: string;
  label: 'reforça' | 'causa' | 'evita' | 'generaliza para' | 'opõe-se a' | 'contextualiza';
}

export interface ABCTemplate {
  id: string;
  name: string;
  antecedentGuide: string;
  behaviorGuide: string;
  consequenceGuide: string;
}

export type ABCCardColor = 'default' | 'red' | 'green' | 'blue' | 'yellow' | 'purple';

export interface CardGroupInfo {
  id: string;
  name: string;
  color: string; 
}

export interface ABCCardData extends BaseCard {
  title: string;
  antecedent: {
    external: string;
    internal: string;
    thoughtBelief?: number; 
    emotionIntensity?: number; 
  };
  behavior: string;
  consequence: {
    shortTermGain: string;
    shortTermCost: string;
    longTermValueCost: string;
  };
  tags: string[];
  color: ABCCardColor;
  notes?: string;
  position?: XYPosition;
  groupInfo?: CardGroupInfo; 
}

export interface SchemaData {
  id: string;
  tabId: string; // Added tabId
  rule: string;
  linkedCardIds: string[];
  notes?: string;
  position?: XYPosition;
}

export interface FormulationGuideQuestion {
  id: string;
  text: string;
}

export interface QuickNote {
  id: string;
  tabId: string; // Added tabId
  text: string;
  linkedCardId?: string; 
  createdAt: string; 
  position?: XYPosition; 
  title?: string; 
}

export interface CardGroup { 
  id: string;
  tabId: string; // Added tabId
  name: string;
  color: string; 
}


export type ClinicalNodeType = 'abcCard' | 'schemaNode';

export interface NodeDataBase {
  id: string;
  tabId: string; // Ensure all node data includes tabId
}

export type ClinicalNodeData = (ABCCardData | SchemaData) & NodeDataBase;


export function isABCCardData(data: ClinicalNodeData | undefined | null): data is ABCCardData {
  return !!data && (data as ABCCardData).title !== undefined && (data as ABCCardData).antecedent !== undefined;
}


export function isSchemaData(data: ClinicalNodeData | undefined | null): data is SchemaData {
  return !!data && (data as SchemaData).rule !== undefined;
}

// New ClinicalTab type
export type ClinicalTabType = 'formulation' | 'chain' | 'matrix' | 'hexaflex' | 'custom';

export interface ClinicalTab {
  id: string;
  type: ClinicalTabType;
  title: string;
  createdAt: string; // ISO date string
}

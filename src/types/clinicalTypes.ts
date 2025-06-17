
import type { XYPosition } from 'reactflow';

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
  color: string; // Tailwind border color class, e.g., "border-red-500"
}

export interface ABCCardData {
  id: string;
  title: string;
  antecedent: {
    external: string;
    internal: string;
    thoughtBelief?: number; // Intensity 0-100
    emotionIntensity?: number; // Intensity 0-100
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
  groupInfo?: CardGroupInfo; // Added for card grouping
}

export interface SchemaData {
  id: string;
  rule: string;
  linkedCardIds: string[];
  notes?: string;
  position?: XYPosition;
}

export interface FormulationGuideQuestion {
  id: string;
  text: string;
  // 'answered' state will be managed in the store by answers Record
}

export interface QuickNote {
  id: string;
  text: string;
  linkedCardId?: string; // ID of an ABCCardNode
  createdAt: string; // ISO date string
  position?: XYPosition; // For potential future rendering on map
  title?: string; // Optional title for the note
}

export interface CardGroup { // Definition of a group
  id: string;
  name: string;
  color: string; // Tailwind border color class like "border-red-500" or "bg-red-500/10" for badge
}


// Tipos para os nós do React Flow
export type ClinicalNodeType = 'abcCard' | 'schemaNode';

// Base para os dados dos nós, assegurando que sempre haja um ID.
export interface NodeDataBase {
  id: string;
}

export type ClinicalNodeData = ABCCardData | SchemaData;

// Typeguard para ABCCardData
export function isABCCardData(data: ClinicalNodeData | undefined | null): data is ABCCardData {
  return !!data && (data as ABCCardData).title !== undefined && (data as ABCCardData).antecedent !== undefined;
}

// Typeguard para SchemaData
export function isSchemaData(data: ClinicalNodeData | undefined | null): data is SchemaData {
  return !!data && (data as SchemaData).rule !== undefined;
}

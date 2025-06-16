
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
}

export interface SchemaData {
  id: string;
  rule: string;
  linkedCardIds: string[];
  notes?: string; 
  position?: XYPosition; 
}

// Tipos para os nós do React Flow
export type ClinicalNodeType = 'abcCard' | 'schemaNode';

export interface NodeDataBase { 
  id: string;
}

export type ClinicalNodeData = ABCCardData | SchemaData;

// Tipo para os dados de um nó ABCCardData (para typeguard)
export function isABCCardData(data: ClinicalNodeData): data is ABCCardData {
  return (data as ABCCardData).title !== undefined;
}

// Tipo para os dados de um nó SchemaData (para typeguard)
export function isSchemaData(data: ClinicalNodeData): data is SchemaData {
  return (data as SchemaData).rule !== undefined;
}

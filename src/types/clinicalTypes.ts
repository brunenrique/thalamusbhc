
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

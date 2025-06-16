
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
  color: 'default' | 'red' | 'green' | 'blue' | 'yellow' | 'purple';
  notes?: string; // Campo adicional para anotações no card
  position?: XYPosition; // Posição no React Flow
}

export interface SchemaData {
  id: string;
  rule: string;
  linkedCardIds: string[];
  notes?: string; // Campo adicional
  position?: XYPosition; // Posição no React Flow
}

// Tipos para os nós do React Flow
export type ClinicalNodeType = 'abcCard' | 'schemaNode';

export interface NodeDataBase {
  id: string;
  type: ClinicalNodeType;
  label?: string; // Pode ser o título do card ou a regra do schema
}

export interface ABCCardNodeData extends NodeDataBase, ABCCardData {
  type: 'abcCard';
}

export interface SchemaNodeData extends NodeDataBase, SchemaData {
  type: 'schemaNode';
}

export type ClinicalNodeData = ABCCardNodeData | SchemaNodeData;

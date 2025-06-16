
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

export interface NodeDataBase { // Renomeado de ClinicalNodeBase para NodeDataBase
  id: string;
  // type: ClinicalNodeType; // O type já está no objeto Node do React Flow
  // label?: string; // O label pode vir do data.title ou data.rule
}

// Ajuste para que ABCCardNodeData e SchemaNodeData herdem de suas respectivas interfaces de dados
// e não diretamente de NodeDataBase, pois o 'data' do nó do React Flow já conterá esses objetos.
// A ideia é que Node<ClinicalNodeData>['data'] seja ABCCardData | SchemaData

export type ClinicalNodeData = ABCCardData | SchemaData; // Este é o tipo para o campo `data` de um Node.

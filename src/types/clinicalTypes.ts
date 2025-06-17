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

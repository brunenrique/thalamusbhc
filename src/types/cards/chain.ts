import { BaseCard } from './base';

export interface ChainCard extends BaseCard {
  type: 'chain';
  vulnerability: string;
  trigger: string;
  thought: string;
  emotion: { name: string; intensity: number };
  behavior: string;
  consequenceImmediate: string;
  consequenceLongTerm: string;
  interventionPoints: string[];
}

import { BaseCard } from './base';

export interface ABCCard extends BaseCard {
  type: 'abc';
  antecedent: string;
  behavior: string;
  consequence: string;
}

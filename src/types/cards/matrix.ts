import { BaseCard } from './base';

export interface MatrixCard extends BaseCard {
  type: 'matrix';
  awayMoves: string[];
  towardMoves: string[];
  thoughts: string[];
  sensations: string[];
}

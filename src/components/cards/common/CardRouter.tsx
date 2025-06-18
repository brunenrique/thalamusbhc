import React from 'react';
import type { BaseCard } from '@/types/cards';
import { cardTypeRegistry } from '@/constants/cardRegistry';

interface CardRouterProps {
  card: BaseCard;
}

const CardRouter: React.FC<CardRouterProps> = ({ card }) => {
  const entry = (cardTypeRegistry as any)[card.type];
  if (entry && entry.component) {
    const Component = entry.component;
    return <Component card={card} />;
  }

  const Generic = cardTypeRegistry['generic']?.component || (() => <div>Generic Card</div>);
  return <Generic card={card} />;
};

export default CardRouter;

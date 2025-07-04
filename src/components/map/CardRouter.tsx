import React from 'react';
import { BaseCard, ABCCard } from '@/types/clinicalTypes';

// Assuming these components exist. Create placeholder components if needed.
import ABCCardNode from '../cards/ABC/ABCCardNode';
import ChainCardNode from '../cards/Chain/ChainCardNode';
import MatrixCardNode from '../cards/Matrix/MatrixCardNode';
import GenericCardNode from '../cards/Generic/GenericCardNode';

interface CardRouterProps {
  card: BaseCard;
}

const CardRouter: React.FC<CardRouterProps> = ({ card }) => {
  switch (card.type) {
    case 'abc':
      return <ABCCardNode card={card as ABCCard} />;
    case 'chain':
      return <ChainCardNode card={card} />;
    case 'matrix':
      return <MatrixCardNode card={card} />;
    default:
      return <GenericCardNode card={card} />;
  }
};

export default CardRouter;

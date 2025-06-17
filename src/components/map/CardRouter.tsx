import React from 'react';
import { BaseCard } from '../types/clinicalTypes'; // Adjust the import path as needed
import { ABCCard } from '../types/clinicalTypes'; // Adjust the import path as needed

// Assuming these components exist. Create placeholder components if needed.
import ABCCardNode from './ABCCardNode';
import ChainCardNode from './ChainCardNode';
import MatrixCardNode from './MatrixCardNode';
import GenericCardNode from './GenericCardNode';

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
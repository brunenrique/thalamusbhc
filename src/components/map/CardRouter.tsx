import React from 'react';
import { BaseCard } from '../types/clinicalTypes'; // Adjust the import path as needed
import { ABCCard } from '../types/clinicalTypes'; // Adjust the import path as needed

// Assuming these components exist. Create placeholder components if needed.
import ABCCardNode from '/home/user/studio/src/components/cards/ABC/ABCCardNode';
import ChainCardNode from '/home/user/studio/src/components/cards/Chain/ChainCardNode';
import MatrixCardNode from '/home/user/studio/src/components/cards/Matrix/MatrixCardNode';
import GenericCardNode from '/home/user/studio/src/components/cards/Generic/GenericCardNode';

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
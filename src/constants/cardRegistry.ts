
import React from 'react';
import ABCCardNode from '@/components/cards/ABC/ABCCardNode';
import ChainCardNode from '@/components/cards/Chain/ChainCardNode';
import MatrixCardNode from '@/components/cards/Matrix/MatrixCardNode';
// import GenericCardNode from '@/components/cards/Generic/GenericCardNode'; // Comentado pois será definido inline

import ABCForm from '@/components/cards/ABC/ABCForm';
import ChainForm from '@/components/cards/Chain/ChainCardForm';
import MatrixForm from '@/components/cards/Matrix/MatrixCardForm';

export const cardTypeRegistry = {
  abc: {
    label: 'Modelo ABC',
    color: 'bg-blue-100',
    icon: '🧠', // Using a brain emoji as a placeholder
    form: ABCForm,
    component: ABCCardNode,
  },
  chain: {
    label: 'Cadeia Comportamental',
    color: 'bg-green-100',
    icon: '🔗', // Using a link emoji
    form: ChainForm,
    component: ChainCardNode,
  },
  matrix: {
    label: 'Matriz ACT',
    color: 'bg-purple-100',
    icon: '🔳', // Using a square emoji
    form: MatrixForm,
    component: MatrixCardNode,
  },
  generic: {
    label: 'Genérico',
    color: 'bg-gray-100',
    icon: '📄', // Using a document emoji
    form: undefined,
    component: () => React.createElement('div', null, 'Generic Card'), // JSX substituído por React.createElement
  },
};

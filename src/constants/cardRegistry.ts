import React from "react";
import ABCCardNode from '@/components/cards/ABC/ABCCardNode';
import ChainCardNode from '@/components/cards/Chain/ChainCardNode';
import MatrixCardNode from '@/components/cards/Matrix/MatrixCardNode';
import ABCForm from '@/components/cards/ABC/ABCForm';
import ChainForm from '@/components/cards/Chain/ChainCardForm';
import MatrixForm from '@/components/cards/Matrix/MatrixCardForm';

export const cardTypeRegistry = {
  abc: {
    label: 'Modelo ABC',
    color: 'bg-blue-100',
    icon: '🧠',
    form: ABCForm,
    component: ABCCardNode,
  },
  chain: {
    label: 'Cadeia Comportamental',
    color: 'bg-green-100',
    icon: '🔗',
    form: ChainForm,
    component: ChainCardNode,
  },
  matrix: {
    label: 'Matriz ACT',
    color: 'bg-purple-100',
    icon: '🔳',
    form: MatrixForm,
    component: MatrixCardNode,
  },
  generic: {
    label: 'Genérico',
    color: 'bg-gray-100',
    icon: '📄',
    form: undefined,
    component: () => { return <div>Generic Card</div>; },
  },
};

// src/components/atoms/button.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from './button';

// O jest.mock não é necessário aqui, pois o botão não tem dependências complexas.

describe('Componente Button', () => {
  it('deve renderizar o botão com o texto filho corretamente', () => {
    render(<Button>Clique Aqui</Button>);
    
    // Procura por um elemento com a role 'button' e o texto 'Clique Aqui'
    const buttonElement = screen.getByRole('button', { name: /clique aqui/i });
    
    // Verifica se o botão está no documento
    expect(buttonElement).toBeInTheDocument();
  });
});
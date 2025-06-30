// src/features/patient-hub/components/SessionNotesList.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SessionNotesList } from './SessionNotesList';

describe('SessionNotesList', () => {
  it('should display loading state', () => {
    render(<SessionNotesList data={undefined} isLoading={true} isError={false} />);
    expect(screen.getByText(/anotações de sessão/i)).toBeInTheDocument();
    expect(screen.getAllByRole('status')).toHaveLength(3); // Assuming 3 skeleton lines
  });

  it('should display error message', () => {
    render(<SessionNotesList data={undefined} isLoading={false} isError={true} />);
    expect(screen.getByText(/erro ao carregar as anotações de sessão/i)).toBeInTheDocument();
  });

  it('should display no notes message if data is empty', () => {
    render(<SessionNotesList data={[]} isLoading={false} isError={false} />);
    expect(screen.getByText(/nenhuma anotação de sessão encontrada/i)).toBeInTheDocument();
  });

  it('should display session notes when data is provided', () => {
    const mockNotes = [
      { id: '1', date: '2024-01-01', title: 'Sessão 1', content: 'Conteúdo da sessão 1.' },
      { id: '2', date: '2024-01-08', title: 'Sessão 2', content: 'Conteúdo da sessão 2.' },
    ];
    render(<SessionNotesList data={mockNotes} isLoading={false} isError={false} />);

    expect(screen.getByText('Sessão 1')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo da sessão 1.')).toBeInTheDocument();
    expect(screen.getByText('Sessão 2')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo da sessão 2.')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /ver mais/i })).toHaveLength(2);
  });
});

import React from 'react';
import { useClinicalStore } from '@/stores/clinicalStore';

const SECTIONS = [
  { key: 'defusion', label: 'Defusão', explanation: 'Estratégias para desfazer a fusão com pensamentos.' },
  { key: 'acceptance', label: 'Aceitação', explanation: 'Abertura para experiências internas desconfortáveis.' },
  { key: 'present', label: 'Contato com o presente', explanation: 'Atenção plena ao aqui e agora.' },
  { key: 'selfContext', label: 'Eu como contexto', explanation: 'Percepção do self observador.' },
  { key: 'values', label: 'Valores', explanation: 'Direcionadores de ações significativas.' },
  { key: 'action', label: 'Ação compromissada', explanation: 'Comportamentos guiados por valores.' }
];

const positions = [
  'top-0 left-1/2 -translate-x-1/2',
  'top-1/4 right-0 -translate-y-1/2',
  'bottom-1/4 right-0 translate-y-1/2',
  'bottom-0 left-1/2 -translate-x-1/2',
  'bottom-1/4 left-0 translate-y-1/2',
  'top-1/4 left-0 -translate-y-1/2'
];

const HexaflexPanel: React.FC = () => {
  const { panelState, setPanelState } = useClinicalStore();
  const state = panelState.hexaflex || {};
  const activeSection: string | null = state.activeSection || null;
  const notes = state.notes || {};

  const handleSelect = (key: string) => {
    setPanelState('hexaflex', { ...state, activeSection: key });
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPanelState('hexaflex', {
      ...state,
      notes: { ...notes, [activeSection as string]: e.target.value }
    });
  };

  const currentSection = SECTIONS.find(s => s.key === activeSection);

  return (
    <div className="p-4 border-l border-border bg-background w-80 pointer-events-auto overflow-y-auto flex">
      <div className="relative w-56 h-56 rounded-full border flex-shrink-0 mx-auto">
        {SECTIONS.map((s, idx) => (
          <button
            key={s.key}
            className={`absolute ${positions[idx]} w-20 h-20 text-xs flex items-center justify-center rounded-full bg-accent text-accent-foreground hover:bg-accent/80 transition-colors`}
            onClick={() => handleSelect(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>
      {currentSection && (
        <div className="ml-4 flex-1">
          <h4 className="font-semibold mb-1">{currentSection.label}</h4>
          <p className="text-sm mb-2">{currentSection.explanation}</p>
          <textarea
            className="w-full border rounded p-2 text-sm"
            rows={4}
            value={notes[activeSection as string] || ''}
            onChange={handleNoteChange}
          />
        </div>
      )}
    </div>
  );
};

export default HexaflexPanel;

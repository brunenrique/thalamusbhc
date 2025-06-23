import { render, screen } from '@testing-library/react';
import { MapToolbar } from '@/components/map/MapToolbar';

test('MapToolbar renderiza componentes básicos', () => {
  render(<MapToolbar />);
  expect(screen.getByRole('button', { name: 'Add Card' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Filters' })).toBeInTheDocument();
});

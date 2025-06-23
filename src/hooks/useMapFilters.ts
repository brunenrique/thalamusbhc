import { useState } from 'react';

export interface MapFilters {
  type: string | null;
  sessionNumber: number | null;
  labels: string[];
  showArchived: boolean;
}

export function useMapFilters(initial?: Partial<MapFilters>) {
  const [filters, setFilters] = useState<MapFilters>({
    type: initial?.type ?? null,
    sessionNumber: initial?.sessionNumber ?? null,
    labels: initial?.labels ?? [],
    showArchived: initial?.showArchived ?? false,
  });

  const updateFilter = (key: keyof MapFilters, value: any) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  return { filters, setFilters: updateFilter };
}

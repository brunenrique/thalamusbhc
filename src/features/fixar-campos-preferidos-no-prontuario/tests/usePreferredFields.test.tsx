/* eslint-env browser */
/* global window */
import { renderHook, act } from '@testing-library/react';
import { usePreferredFields } from '../hooks/usePreferredFields';
import { Field } from '../schemas';

describe('usePreferredFields', () => {
  const defaults: Field[] = [
    { id: 'a', label: 'A', pinned: true },
    { id: 'b', label: 'B', pinned: false },
  ];

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('loads defaults', () => {
    const { result } = renderHook(() => usePreferredFields(defaults));
    expect(result.current.fields).toEqual(defaults);
  });

  it('saves to localStorage', () => {
    const { result } = renderHook(() => usePreferredFields(defaults));
    act(() => {
      result.current.save([{ id: 'x', label: 'X', pinned: true }]);
    });
    expect(result.current.fields).toEqual([{ id: 'x', label: 'X', pinned: true }]);
    expect(JSON.parse(window.localStorage.getItem('preferredFields') || 'null')).toEqual({
      fields: [{ id: 'x', label: 'X', pinned: true }],
    });
  });
});

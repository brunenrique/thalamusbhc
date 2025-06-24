import { renderHook, act } from '@testing-library/react';
import useAuth from '@/hooks/use-auth';
import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import { USER_ROLES } from '@/constants/roles';

type Callback = Parameters<typeof onAuthStateChanged>[1];

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  getIdTokenResult: jest.fn(),
}));

describe('useAuth', () => {
  it('define usuário autenticado', async () => {
    const user = { uid: '1', displayName: 'Alice', email: 'a@b.com', photoURL: null } as any;
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, cb: Callback) => {
      cb(user);
      return () => {};
    });
    (getIdTokenResult as jest.Mock).mockResolvedValue({ claims: { role: USER_ROLES.ADMIN } });

    const { result } = renderHook(() => useAuth());
    await act(async () => {});
    expect(result.current.user?.uid).toBe('1');
    expect(result.current.user?.role).toBe(USER_ROLES.ADMIN);
  });
});

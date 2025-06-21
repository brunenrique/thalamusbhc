
'use client';

import { getAuth, getIdTokenResult } from 'firebase/auth';

export type UserRole = 'Admin' | 'Psychologist' | 'Secretary';

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const { claims } = await getIdTokenResult(user);
    const role = claims.role as UserRole | undefined;
    return role ?? null;
  } catch (error) {
    console.error('Erro ao obter role do usuário', error);
    return null;
  }
}

export async function checkUserRole(required: string | string[]): Promise<boolean> {
  const expectedRoles = Array.isArray(required) ? required : [required];
  const currentRole = await getCurrentUserRole();
  if (!currentRole) return false;
  return expectedRoles.includes(currentRole);
}

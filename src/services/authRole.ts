'use client';

import { getAuth, getIdTokenResult } from 'firebase/auth';
import * as Sentry from '@sentry/nextjs';
import logger from '@/lib/logger';
import type { UserRole } from '@/constants/roles';

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const { claims } = await getIdTokenResult(user);
    const role = claims.role as UserRole | undefined;
    return role ?? null;
  } catch (error) {
    Sentry.captureException(error);
    logger.error({ action: 'get_role_error', meta: { error } });
    return null;
  }
}

export async function checkUserRole(required: UserRole | UserRole[]): Promise<boolean> {
  const expectedRoles = Array.isArray(required) ? required : [required];
  const currentRole = await getCurrentUserRole();
  if (!currentRole) return false;
  return expectedRoles.includes(currentRole);
}

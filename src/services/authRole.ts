
'use client';

// import { auth } from '@/lib/firebase'; // Firebase Auth disabled
// import { getIdTokenResult } from 'firebase/auth'; // Firebase Auth disabled

export type UserRole = 'Admin' | 'Psychologist' | 'Secretary';

export async function getCurrentUserRole(): Promise<UserRole | null> {
  // Authentication is disabled, return a mock role or null.
  // Returning 'Admin' for now to allow access to admin-only features during development.
  return 'Admin';
}

export async function checkUserRole(_required: UserRole | UserRole[]): Promise<boolean> {
  // Authentication is disabled, always allow access.
  return true;
}

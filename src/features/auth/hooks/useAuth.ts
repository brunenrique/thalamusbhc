
import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import logger from '@/lib/logger';
import {
  getAuth,
  onAuthStateChanged,
  getIdTokenResult,
  type User as FirebaseUser,
} from 'firebase/auth';

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: string | null;
}

export default function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }

      try {
        const tokenResult = await getIdTokenResult(firebaseUser);
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          role: (tokenResult.claims.role as string | undefined) ?? null,
        });
      } catch (error) {
        Sentry.captureException(error);
        logger.error({ action: 'get_token_error', meta: { error } });
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          role: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return { user };
}

import {
  doc,
  getDoc,
  type Firestore,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS } from '@/lib/firestore-collections';
import type { UserProfile } from '@/types/user';
import * as Sentry from '@sentry/nextjs';
import logger from '@/lib/logger';

export async function fetchUserProfile(
  uid: string,
  firestore: Firestore = db
): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(firestore, FIRESTORE_COLLECTIONS.USERS, uid));
    if (!snap.exists()) return null;
    const data = snap.data() as Record<string, any>;
    return {
      id: snap.id,
      name: data.name,
      email: data.email,
      role: data.role,
      gender: data.gender,
      specialty: data.specialty,
      phone: data.phone,
      clinicName: data.clinicName,
      dateRegistered: data.dateRegistered?.toDate
        ? data.dateRegistered.toDate().toISOString()
        : data.dateRegistered,
      avatarUrl: data.avatarUrl,
    } as UserProfile;
  } catch (err) {
    Sentry.captureException(err);
    logger.error({ action: 'fetch_user_profile_error', meta: { error: err } });
    return null;
  }
}

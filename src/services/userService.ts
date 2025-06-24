import { doc, getDoc, setDoc, type Firestore } from 'firebase/firestore';
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

export async function assignRoleToUserInGroup(
  groupId: string,
  userId: string,
  role: string,
  firestore: Firestore = db
): Promise<void> {
  try {
    const ref = doc(firestore, FIRESTORE_COLLECTIONS.GROUPS, groupId, 'members', userId);
    await setDoc(ref, { role }, { merge: true });
  } catch (err) {
    Sentry.captureException(err);
    logger.error({
      action: 'assign_role_to_user_in_group_error',
      meta: { groupId, userId, role, error: err },
    });
    throw err;
  }
}

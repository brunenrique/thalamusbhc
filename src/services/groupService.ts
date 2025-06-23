import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  type Firestore,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS } from '@/lib/firestore-collections';
import { writeAuditLog } from './auditLogService';
import * as Sentry from '@sentry/nextjs';
import type { GroupResource } from '@/types/group';
import logger from '@/lib/logger';

export interface GroupInput {
  name: string;
  description?: string;
  psychologistId: string;
  patientIds: string[];
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  meetingAgenda?: string;
  nextSession?: string;
  resources?: GroupResource[];
}

export interface GroupRecord extends GroupInput {
  id: string;
  ownerId: string;
}

export async function fetchGroups(firestore: Firestore = db): Promise<GroupRecord[]> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) return [];
    const q = query(
      collection(firestore, FIRESTORE_COLLECTIONS.GROUPS),
      where('ownerId', '==', uid),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GroupRecord, 'id'>) }));
  } catch (err) {
    Sentry.captureException(err);
    logger.error({ action: 'fetch_groups_error', meta: { error: err } });
    return [];
  }
}

export async function fetchGroup(
  id: string,
  firestore: Firestore = db,
): Promise<GroupRecord | null> {
  try {
    const ref = doc(firestore, FIRESTORE_COLLECTIONS.GROUPS, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data() as Omit<GroupRecord, 'id'>;
    return { id: snap.id, ...data };
  } catch (err) {
    Sentry.captureException(err);
    logger.error({ action: 'fetch_group_error', meta: { id, error: err } });
    return null;
  }
}

export async function createGroup(
  data: GroupInput,
  firestore: Firestore = db,
): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado');
  const docRef = await addDoc(
    collection(firestore, FIRESTORE_COLLECTIONS.GROUPS),
    { ...data, ownerId: uid },
  );
  await writeAuditLog(
    {
      userId: uid,
      actionType: 'createGroup',
      timestamp: new Date().toISOString(),
      targetResourceId: docRef.id,
    },
    firestore,
  );
  return docRef.id;
}

export async function updateGroup(
  id: string,
  data: Partial<GroupInput>,
  firestore: Firestore = db,
): Promise<void> {
  try {
    await setDoc(
      doc(firestore, FIRESTORE_COLLECTIONS.GROUPS, id),
      data,
      { merge: true },
    );
    const uid = auth.currentUser?.uid;
    if (uid) {
      await writeAuditLog(
        {
          userId: uid,
          actionType: 'updateGroup',
          timestamp: new Date().toISOString(),
          targetResourceId: id,
        },
        firestore,
      );
    }
  } catch (err) {
    Sentry.captureException(err);
    logger.error({ action: 'update_group_error', meta: { id, error: err } });
    throw err;
  }
}

export async function deleteGroup(
  id: string,
  firestore: Firestore = db,
): Promise<void> {
  try {
    await deleteDoc(
      doc(firestore, FIRESTORE_COLLECTIONS.GROUPS, id),
    );
    const uid = auth.currentUser?.uid;
    if (uid) {
      await writeAuditLog(
        {
          userId: uid,
          actionType: 'deleteGroup',
          timestamp: new Date().toISOString(),
          targetResourceId: id,
        },
        firestore,
      );
    }
  } catch (err) {
    Sentry.captureException(err);
    logger.error({ action: 'delete_group_error', meta: { id, error: err } });
    throw err;
  }
}

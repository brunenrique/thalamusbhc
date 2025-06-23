import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  doc,
  query,
  where,
  type Firestore,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS } from '@/lib/firestore-collections';
import { writeAuditLog } from './auditLogService';
import * as Sentry from '@sentry/nextjs';
import type { GroupResource } from '@/types/group';

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
      where('ownerId', '==', uid)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GroupRecord, 'id'>) }));
  } catch (err) {
    Sentry.captureException(err);
    console.error('Erro ao buscar grupos', err);
    return [];
  }
}

export async function createGroup(data: GroupInput, firestore: Firestore = db): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado');
  const docRef = await addDoc(collection(firestore, FIRESTORE_COLLECTIONS.GROUPS), {
    ...data,
    ownerId: uid,
  });
  await writeAuditLog(
    {
      userId: uid,
      actionType: 'createGroup',
      timestamp: new Date().toISOString(),
      targetResourceId: docRef.id,
    },
    firestore
  );
  return docRef.id;
}

export async function updateGroup(
  id: string,
  data: Partial<GroupInput>,
  firestore: Firestore = db
): Promise<void> {
  await setDoc(doc(firestore, FIRESTORE_COLLECTIONS.GROUPS, id), data, { merge: true });
  const uid = auth.currentUser?.uid;
  if (uid) {
    await writeAuditLog(
      {
        userId: uid,
        actionType: 'updateGroup',
        timestamp: new Date().toISOString(),
        targetResourceId: id,
      },
      firestore
    );
  }
}

export async function deleteGroup(id: string, firestore: Firestore = db): Promise<void> {
  await deleteDoc(doc(firestore, FIRESTORE_COLLECTIONS.GROUPS, id));
  const uid = auth.currentUser?.uid;
  if (uid) {
    await writeAuditLog(
      {
        userId: uid,
        actionType: 'deleteGroup',
        timestamp: new Date().toISOString(),
        targetResourceId: id,
      },
      firestore
    );
  }
}

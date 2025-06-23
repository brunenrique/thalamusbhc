'use client';

import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  type Firestore,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS } from '@/lib/firestore-collections';
import { writeAuditLog } from './auditLogService';
import type { Group } from '@/types/group';

export interface GroupInput {
  name: string;
  description?: string;
  psychologistId: string;
  patientIds: string[];
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  meetingAgenda?: string;
}

export async function fetchGroups(): Promise<Group[]> {
  const uid = auth.currentUser?.uid;
  if (!uid) return [];
  const q = query(collection(db, FIRESTORE_COLLECTIONS.GROUPS), where('ownerId', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Group, 'id'>) }));
}

export async function fetchGroup(id: string): Promise<Group | null> {
  const ref = doc(db, FIRESTORE_COLLECTIONS.GROUPS, id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...(snap.data() as Omit<Group, 'id'>) } : null;
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
  const ref = doc(firestore, FIRESTORE_COLLECTIONS.GROUPS, id);
  await setDoc(ref, data, { merge: true });
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

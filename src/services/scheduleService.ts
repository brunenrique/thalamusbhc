'use client';

import { collection, addDoc, doc, setDoc, type Firestore } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS } from '@/lib/firestore-collections';
import { writeAuditLog } from './auditLogService';

export interface ScheduleInput {
  dateTime: Date;
  notes: string;
}

export async function createSchedule(
  data: ScheduleInput,
  firestore: Firestore = db
): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado');
  const docRef = await addDoc(collection(firestore, FIRESTORE_COLLECTIONS.SCHEDULES), {
    ...data,
    ownerId: uid,
  });
  await writeAuditLog(
    {
      userId: uid,
      actionType: 'createSchedule',
      timestamp: new Date().toISOString(),
      targetResourceId: docRef.id,
    },
    firestore
  );
  return docRef.id;
}

export async function updateSchedule(
  id: string,
  data: Partial<ScheduleInput>,
  firestore: Firestore = db
): Promise<void> {
  const ref = doc(firestore, FIRESTORE_COLLECTIONS.SCHEDULES, id);
  await setDoc(ref, data, { merge: true });
  const uid = auth.currentUser?.uid;
  if (uid) {
    await writeAuditLog(
      {
        userId: uid,
        actionType: 'updateSchedule',
        timestamp: new Date().toISOString(),
        targetResourceId: id,
      },
      firestore
    );
  }
}

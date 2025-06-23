'use client';

import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  type Firestore,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS } from '@/lib/firestore-collections';
import type { Task } from '@/types';
import { format } from 'date-fns';
import { writeAuditLog } from './auditLogService';

export async function getTasks(): Promise<Task[]> {
  const q = query(collection(db, FIRESTORE_COLLECTIONS.TASKS), orderBy('dueDate'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Task, 'id'>) }));
}

export async function getTaskById(id: string): Promise<Task | undefined> {
  const docSnap = await getDoc(doc(db, FIRESTORE_COLLECTIONS.TASKS, id));
  return docSnap.exists() ? { id: docSnap.id, ...(docSnap.data() as Omit<Task, 'id'>) } : undefined;
}

export async function getTasksForDate(date: Date): Promise<Task[]> {
  const dateStr = format(date, 'yyyy-MM-dd');
  const q = query(collection(db, FIRESTORE_COLLECTIONS.TASKS), where('dueDate', '==', dateStr));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Task, 'id'>) }));
}

export async function createTask(
  data: Omit<Task, 'id'>,
  firestore: Firestore = db,
): Promise<string> {
  const docRef = await addDoc(
    collection(firestore, FIRESTORE_COLLECTIONS.TASKS),
    data,
  );
  const uid = auth.currentUser?.uid;
  if (uid) {
    await writeAuditLog(
      {
        userId: uid,
        actionType: 'createTask',
        timestamp: new Date().toISOString(),
        targetResourceId: docRef.id,
      },
      firestore,
    );
  }
  return docRef.id;
}

export async function updateTask(
  id: string,
  updates: Partial<Omit<Task, 'id'>>,
  firestore: Firestore = db,
): Promise<void> {
  await updateDoc(doc(firestore, FIRESTORE_COLLECTIONS.TASKS, id), updates);
  const uid = auth.currentUser?.uid;
  if (uid) {
    await writeAuditLog(
      {
        userId: uid,
        actionType: 'updateTask',
        timestamp: new Date().toISOString(),
        targetResourceId: id,
      },
      firestore,
    );
  }
}

export async function deleteTask(
  id: string,
  firestore: Firestore = db,
): Promise<void> {
  await deleteDoc(doc(firestore, FIRESTORE_COLLECTIONS.TASKS, id));
  const uid = auth.currentUser?.uid;
  if (uid) {
    await writeAuditLog(
      {
        userId: uid,
        actionType: 'deleteTask',
        timestamp: new Date().toISOString(),
        targetResourceId: id,
      },
      firestore,
    );
  }
}

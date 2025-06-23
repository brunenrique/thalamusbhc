'use client';

import { db, auth } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS } from '@/lib/firestore-collections';
import type { WaitingListEntry } from '@/types';
import { writeAuditLog } from './auditLogService';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  type Firestore,
} from 'firebase/firestore';

export async function getWaitingList(): Promise<WaitingListEntry[]> {
  const q = query(
    collection(db, FIRESTORE_COLLECTIONS.WAITING_LIST),
    orderBy('dateAdded', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<WaitingListEntry, 'id'>) }));
}

export async function getWaitingListEntries(): Promise<WaitingListEntry[]> {
  return getWaitingList();
}

export async function getWaitingListEntryById(id: string): Promise<WaitingListEntry | undefined> {
  const docSnap = await getDoc(doc(db, FIRESTORE_COLLECTIONS.WAITING_LIST, id));
  return docSnap.exists()
    ? { id: docSnap.id, ...(docSnap.data() as Omit<WaitingListEntry, 'id'>) }
    : undefined;
}

export async function createWaitingListEntry(
  data: Omit<WaitingListEntry, 'id' | 'dateAdded'>,
  firestore: Firestore = db,
): Promise<string> {
  const docRef = await addDoc(collection(firestore, FIRESTORE_COLLECTIONS.WAITING_LIST), {
    ...data,
    dateAdded: new Date().toISOString(),
  });
  const uid = auth.currentUser?.uid;
  if (uid) {
    await writeAuditLog(
      {
        userId: uid,
        actionType: 'createWaitingListEntry',
        timestamp: new Date().toISOString(),
        targetResourceId: docRef.id,
      },
      firestore,
    );
  }
  return docRef.id;
}

export async function updateWaitingListEntry(
  id: string,
  data: Partial<Omit<WaitingListEntry, 'id' | 'dateAdded'>>,
  firestore: Firestore = db,
): Promise<void> {
  await updateDoc(doc(firestore, FIRESTORE_COLLECTIONS.WAITING_LIST, id), data);
  const uid = auth.currentUser?.uid;
  if (uid) {
    await writeAuditLog(
      {
        userId: uid,
        actionType: 'updateWaitingListEntry',
        timestamp: new Date().toISOString(),
        targetResourceId: id,
      },
      firestore,
    );
  }
}

export async function deleteWaitingListEntry(
  id: string,
  firestore: Firestore = db,
): Promise<void> {
  await deleteDoc(doc(firestore, FIRESTORE_COLLECTIONS.WAITING_LIST, id));
  const uid = auth.currentUser?.uid;
  if (uid) {
    await writeAuditLog(
      {
        userId: uid,
        actionType: 'deleteWaitingListEntry',
        timestamp: new Date().toISOString(),
        targetResourceId: id,
      },
      firestore,
    );
  }
}

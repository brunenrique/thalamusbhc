// src/services/quickNoteService.ts
'use client';

import { collection, addDoc, getDocs, query, where, orderBy, type Firestore } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS } from '@/lib/firestore-collections';
import type { QuickNote } from '@/types/clinicalTypes';
import { writeAuditLog } from './auditLogService';

export interface QuickNoteInput {
  text: string;
  title?: string;
  linkedCardId?: string;
}

export async function createQuickNote(
  patientId: string,
  data: QuickNoteInput,
  firestore: Firestore = db,
): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado');
  const docRef = await addDoc(collection(firestore, FIRESTORE_COLLECTIONS.QUICK_NOTES), {
    ownerId: uid,
    patientId,
    text: data.text,
    title: data.title ?? null,
    linkedCardId: data.linkedCardId ?? null,
    createdAt: new Date().toISOString(),
  });
  await writeAuditLog(
    {
      userId: uid,
      actionType: 'createQuickNote',
      timestamp: new Date().toISOString(),
      targetResourceId: docRef.id,
    },
    firestore,
  );
  return docRef.id;
}

export async function getQuickNotes(
  patientId: string,
  firestore: Firestore = db,
): Promise<QuickNote[]> {
  const uid = auth.currentUser?.uid;
  if (!uid) return [];
  const q = query(
    collection(firestore, FIRESTORE_COLLECTIONS.QUICK_NOTES),
    where('patientId', '==', patientId),
    where('ownerId', '==', uid),
    orderBy('createdAt', 'asc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      text: data.text,
      title: data.title ?? undefined,
      linkedCardId: data.linkedCardId ?? undefined,
      createdAt: data.createdAt,
    } as QuickNote;
  });
}

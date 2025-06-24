"use client";

import { addDoc, collection, serverTimestamp, type Firestore } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS } from '@/lib/firestore-collections';

export interface FeedbackEntry {
  uid: string;
  text: string;
  createdAt: unknown;
}

export async function submitFeedback(
  text: string,
  firestore: Firestore = db,
): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado');
  const docRef = await addDoc(collection(firestore, FIRESTORE_COLLECTIONS.FEEDBACK), {
    uid,
    text,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}


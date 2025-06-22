"use client";

export interface SessionNote {
  id: string;
  date: string;
  summary: string;
  [key: string]: unknown;
}

import { addDoc, collection, getDocs, orderBy, query, where, type Firestore } from 'firebase/firestore';
import { encrypt, decrypt, type EncryptionResult } from '@/lib/crypto-utils';
import { getEncryptionKey } from '@/lib/encryptionKey';
import { FIRESTORE_COLLECTIONS } from '@/lib/firestore-collections';

export async function gerarProntuario(
  patientId: string,
  notes: SessionNote[],
): Promise<{ success: boolean; message?: string }> {
  const url = process.env.NEXT_PUBLIC_GAS_PRONTUARIO_URL;
  if (!url) {
    throw new Error("GAS URL não configurada");
  }

  const procedimentoAnalise = notes.map((n) => n.summary).join("\n\n");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      patientId,
      procedimentoAnalise,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Erro ao gerar prontuário");
  }

  return res.json();
}

export async function saveSessionNote(
  db: Firestore,
  patientId: string,
  summary: string,
): Promise<string> {
  const key = getEncryptionKey();
  const encrypted = encrypt(summary, key);
  const docRef = await addDoc(
    collection(db, FIRESTORE_COLLECTIONS.SESSION_NOTES),
    {
      patientId,
      data: encrypted,
      createdAt: new Date().toISOString(),
    },
  );
  return docRef.id;
}

export async function getSessionNotes(
  db: Firestore,
  patientId: string,
): Promise<SessionNote[]> {
  const key = getEncryptionKey();
  const q = query(
    collection(db, FIRESTORE_COLLECTIONS.SESSION_NOTES),
    where('patientId', '==', patientId),
    orderBy('createdAt', 'asc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as {
      data: EncryptionResult;
      createdAt: string;
    };
    return {
      id: d.id,
      date: data.createdAt,
      summary: decrypt(data.data, key),
    };
  });
}

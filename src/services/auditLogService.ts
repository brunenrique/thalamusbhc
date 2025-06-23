import { addDoc, collection, type Firestore } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS } from '@/lib/firestore-collections';

export interface AuditLogEntry {
  userId: string;
  actionType: string;
  timestamp: string;
  targetResourceId?: string;
}

export async function writeAuditLog(
  entry: AuditLogEntry,
  firestore: Firestore = db,
): Promise<string> {
  const docRef = await addDoc(
    collection(firestore, FIRESTORE_COLLECTIONS.AUDIT_LOGS),
    entry,
  );
  return docRef.id;
}

import { addDoc, collection, type Firestore } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS } from '@/lib/firestore-collections';

export interface InsightsLogEntry {
  userId: string;
  timestamp: string;
  cost: number;
}

export async function writeInsightsLog(
  entry: InsightsLogEntry,
  firestore: Firestore = db,
): Promise<string> {
  const docRef = await addDoc(
    collection(firestore, FIRESTORE_COLLECTIONS.INSIGHTS_LOGS),
    entry,
  );
  return docRef.id;
}

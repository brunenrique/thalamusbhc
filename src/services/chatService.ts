import { collection, addDoc, doc, getDoc, type Firestore } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS } from '@/lib/firestore-collections';

export interface Chat {
  participants: Record<string, true>;
}

export async function createChat(
  participantIds: string[],
  firestore: Firestore = db
): Promise<string> {
  if (participantIds.length === 0) {
    throw new Error('Nenhum participante informado');
  }

  const participants: Record<string, true> = {};
  for (const id of participantIds) {
    const userSnap = await getDoc(doc(firestore, FIRESTORE_COLLECTIONS.USERS, id));
    if (!userSnap.exists()) {
      throw new Error(`Usuário ${id} não encontrado`);
    }
    participants[id] = true;
  }

  const ref = await addDoc(collection(firestore, FIRESTORE_COLLECTIONS.CHATS), {
    participants,
  });
  return ref.id;
}

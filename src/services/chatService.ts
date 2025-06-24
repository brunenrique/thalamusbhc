import {
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  type Firestore,
  type Unsubscribe,
} from 'firebase/firestore';
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

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  createdAt: unknown;
}

export async function sendMessage(
  conversationId: string,
  messageData: { text: string; senderId: string },
  firestore: Firestore = db,
): Promise<void> {
  const messagesColRef = collection(
    firestore,
    'conversations',
    conversationId,
    'messages',
  );
  await addDoc(messagesColRef, {
    ...messageData,
    createdAt: serverTimestamp(),
  });
}

export function listenForMessages(
  conversationId: string,
  callback: (messages: ChatMessage[]) => void,
  firestore: Firestore = db,
): Unsubscribe {
  const messagesColRef = collection(
    firestore,
    'conversations',
    conversationId,
    'messages',
  );
  const q = query(messagesColRef, orderBy('createdAt', 'asc'));
  return onSnapshot(q, snap => {
    const list: ChatMessage[] = snap.docs.map(d => ({
      id: d.id,
      ...(d.data() as Omit<ChatMessage, 'id'>),
    }));
    callback(list);
  });
}

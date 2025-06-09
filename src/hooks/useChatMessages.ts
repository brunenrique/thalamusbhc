
import { useState, useEffect } from 'react';
import { db } from '@/services/firebase';
import { collection, query, orderBy, limit, onSnapshot, Timestamp, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { useChatStore } from '@/stores/chatStore';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string | null;
  text: string;
  timestamp: Timestamp | null; // Firestore Timestamp or null if pending
}

export function useChatMessages(chatId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const currentUser = useChatStore((state) => state.currentUser);


  useEffect(() => {
    if (!chatId || !currentUser?.uid) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(30));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const fetchedMessages: Message[] = [];
        querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          fetchedMessages.push({
            id: doc.id,
            senderId: data.senderId,
            senderName: data.senderName,
            senderAvatar: data.senderAvatar, // Assuming you store this
            text: data.text,
            timestamp: data.timestamp as Timestamp | null,
          });
        });
        setMessages(fetchedMessages.reverse()); // Reverse to show oldest first in the array, but Firestore sorts by desc for limit
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching chat messages: ", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [chatId, currentUser?.uid]);

  return { messages, loading, error };
}

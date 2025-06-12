import { messaging, db } from './firebase';
import { getToken } from 'firebase/messaging';
import { doc, setDoc, serverTimestamp, collection, query, orderBy, onSnapshot, Unsubscribe } from 'firebase/firestore';

export interface Notification {
  id: string;
  type: string;
  message: string;
  date: string;
  read: boolean;
  link?: string;
}

export async function registerFcmToken(userId: string): Promise<string | null> {
  if (!messaging) return null;
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    if (token) {
      await setDoc(doc(db, 'users', userId, 'fcmTokens', token), {
        token,
        createdAt: serverTimestamp(),
      });
    }
    return token;
  } catch (err) {
    console.error('Unable to get FCM token', err);
    return null;
  }
}

export function listenToNotifications(userId: string, callback: (n: Notification[]) => void): Unsubscribe {
  const q = query(collection(db, 'users', userId, 'notifications'), orderBy('date', 'desc'));
  return onSnapshot(q, snap => {
    const list: Notification[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Notification,'id'>) }));
    callback(list);
  });
}

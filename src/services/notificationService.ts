import { messaging, db } from '@/lib/firebase'; // Alterado de @/services/firebase
import { getToken } from 'firebase/messaging';
import {
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  where,
  writeBatch,
  collection,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import * as Sentry from '@sentry/nextjs';

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
    Sentry.captureException(err);
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

export async function addNotification(userId: string, data: Omit<Notification, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'users', userId, 'notifications'), data);
  return ref.id;
}

export async function markNotificationRead(userId: string, notifId: string, read = true): Promise<void> {
  await updateDoc(doc(db, 'users', userId, 'notifications', notifId), { read });
}

export async function deleteNotification(userId: string, notifId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId, 'notifications', notifId));
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const q = query(collection(db, 'users', userId, 'notifications'), where('read', '==', false));
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.docs.forEach(d => batch.update(d.ref, { read: true }));
  await batch.commit();
}

export async function clearReadNotifications(userId: string): Promise<void> {
  const q = query(collection(db, 'users', userId, 'notifications'), where('read', '==', true));
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
}

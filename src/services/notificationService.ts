import { messaging, db, auth } from '@/lib/firebase';
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
import { type Firestore } from 'firebase/firestore';
import { writeAuditLog } from './auditLogService';

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

export async function addNotification(
  userId: string,
  data: Omit<Notification, 'id'>,
  firestore: Firestore = db,
): Promise<string> {
  const ref = await addDoc(collection(firestore, 'users', userId, 'notifications'), data);
  const uid = auth.currentUser?.uid;
  if (uid) {
    await writeAuditLog(
      {
        userId: uid,
        actionType: 'addNotification',
        timestamp: new Date().toISOString(),
        targetResourceId: ref.id,
      },
      firestore,
    );
  }
  return ref.id;
}

export async function markNotificationRead(
  userId: string,
  notifId: string,
  read = true,
  firestore: Firestore = db,
): Promise<void> {
  await updateDoc(doc(firestore, 'users', userId, 'notifications', notifId), { read });
  const uid = auth.currentUser?.uid;
  if (uid) {
    await writeAuditLog(
      {
        userId: uid,
        actionType: 'markNotificationRead',
        timestamp: new Date().toISOString(),
        targetResourceId: notifId,
      },
      firestore,
    );
  }
}

export async function deleteNotification(
  userId: string,
  notifId: string,
  firestore: Firestore = db,
): Promise<void> {
  await deleteDoc(doc(firestore, 'users', userId, 'notifications', notifId));
  const uid = auth.currentUser?.uid;
  if (uid) {
    await writeAuditLog(
      {
        userId: uid,
        actionType: 'deleteNotification',
        timestamp: new Date().toISOString(),
        targetResourceId: notifId,
      },
      firestore,
    );
  }
}

export async function markAllNotificationsRead(
  userId: string,
  firestore: Firestore = db,
): Promise<void> {
  const q = query(collection(firestore, 'users', userId, 'notifications'), where('read', '==', false));
  const snap = await getDocs(q);
  const batch = writeBatch(firestore);
  snap.docs.forEach(d => batch.update(d.ref, { read: true }));
  await batch.commit();
  const uid = auth.currentUser?.uid;
  if (uid) {
    await writeAuditLog(
      {
        userId: uid,
        actionType: 'markAllNotificationsRead',
        timestamp: new Date().toISOString(),
      },
      firestore,
    );
  }
}

export async function clearReadNotifications(
  userId: string,
  firestore: Firestore = db,
): Promise<void> {
  const q = query(collection(firestore, 'users', userId, 'notifications'), where('read', '==', true));
  const snap = await getDocs(q);
  const batch = writeBatch(firestore);
  snap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
  const uid = auth.currentUser?.uid;
  if (uid) {
    await writeAuditLog(
      {
        userId: uid,
        actionType: 'clearReadNotifications',
        timestamp: new Date().toISOString(),
      },
      firestore,
    );
  }
}

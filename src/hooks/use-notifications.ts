
import { useEffect, useState } from 'react';
import {
  listenToNotifications,
  Notification,
  markNotificationRead,
  deleteNotification,
  markAllNotificationsRead,
  clearReadNotifications,
} from '@/services/notificationService';
import { auth } from '@/lib/firebase';

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) { setLoading(false); return; }
    const unsub = listenToNotifications(uid, list => {
      setNotifications(list);
      setLoading(false);
    });
    return () => unsub();
  }, [userId]);

  const uid = userId || auth.currentUser?.uid;

  const markAsRead = async (id: string) => {
    if (!uid) return;
    await markNotificationRead(uid, id);
  };

  const dismiss = async (id: string) => {
    if (!uid) return;
    await deleteNotification(uid, id);
  };

  const markAllAsRead = async () => {
    if (!uid) return;
    await markAllNotificationsRead(uid);
  };

  const clearRead = async () => {
    if (!uid) return;
    await clearReadNotifications(uid);
  };

  return { notifications, loading, markAsRead, dismiss, markAllAsRead, clearRead };
}

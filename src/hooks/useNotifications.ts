
import { useEffect, useState } from 'react';
import { listenToNotifications, Notification } from '@/services/notificationService';
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

  return { notifications, loading };
}

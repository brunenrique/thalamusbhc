import { doc, getDoc, setDoc, type Firestore } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

export interface GridItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DashboardLayout {
  widgets: GridItem[];
}

function layoutDoc(uid: string) {
  return doc(db, 'users', uid, 'preferences', 'dashboardLayout');
}

export async function fetchDashboardLayout(
  firestore: Firestore = db
): Promise<DashboardLayout | null> {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;
  const snap = await getDoc(layoutDoc(uid));
  return snap.exists() ? (snap.data() as DashboardLayout) : null;
}

export async function saveDashboardLayout(
  layout: DashboardLayout,
  firestore: Firestore = db
): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  await setDoc(layoutDoc(uid), layout, { merge: true });
}

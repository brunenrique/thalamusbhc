import Charts from './Charts';
import { firestoreAdmin } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';

export const revalidate = 60;

export default async function AnalyticsPage() {
  const usersSnap = await firestoreAdmin.collection('users').get();
  const roleMap: Record<string, number> = {};
  usersSnap.forEach((doc) => {
    const role = (doc.data().role || 'unknown') as string;
    roleMap[role] = (roleMap[role] || 0) + 1;
  });
  const userRoles = Object.entries(roleMap).map(([name, value]) => ({ name, value }));

  const today = new Date();
  const apptSnap = await firestoreAdmin
    .collection('appointments')
    .where('startDate', '>=', Timestamp.fromDate(new Date(today.getTime() - 6 * 86400000)))
    .get();
  const apptMap: Record<string, number> = {};
  apptSnap.forEach((doc) => {
    const d = doc.data().startDate?.toDate();
    if (d) {
      const k = d.toISOString().slice(0, 10);
      apptMap[k] = (apptMap[k] || 0) + 1;
    }
  });
  const appointments = Object.entries(apptMap).map(([day, total]) => ({ day, total }));

  const notifSnap = await firestoreAdmin.collectionGroup('notifications').get();
  const rateMap: Record<string, number> = {};
  notifSnap.forEach((doc) => {
    const d = doc.data().date?.toDate ? doc.data().date.toDate() : null;
    if (d) {
      const k = d.toISOString().slice(0, 10);
      const success = doc.data().read ? 1 : 0;
      rateMap[k] = (rateMap[k] || 0) + success;
    }
  });
  const notifications = Object.entries(rateMap).map(([day, success]) => ({ day, success }));

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold font-headline">Analytics</h1>
      <Charts userRoles={userRoles} appointments={appointments} notifications={notifications} />
    </main>
  );
}

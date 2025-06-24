import Charts from './Charts';
import StatsCard from '@/components/dashboard/stats-card';
import { Clock } from 'lucide-react';
import { firestoreAdmin } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import { USER_ROLES } from '@/constants/roles';

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

  // --- Sessions Analytics ---
  const nameMap: Record<string, string> = {};
  usersSnap.forEach((doc) => {
    const data = doc.data();
    if (data.role === USER_ROLES.PSYCHOLOGIST) {
      nameMap[doc.id] = data.name || doc.id;
    }
  });

  const sessionsSnap = await firestoreAdmin.collection('sessions').get();

  const sessionCount: Record<string, number> = {};
  const weeklyMap: Record<string, number> = {};
  let totalDuration = 0;
  let durationCount = 0;
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);

  sessionsSnap.forEach((doc) => {
    const data = doc.data() as any;
    const psyId = data.psychologistId as string | undefined;
    if (psyId) {
      const key = nameMap[psyId] || psyId;
      sessionCount[key] = (sessionCount[key] || 0) + 1;
    }

    const start = data.startTime?.toDate?.() as Date | undefined;
    const end = data.endTime?.toDate?.() as Date | undefined;
    let duration = data.duration as number | undefined;
    if (!duration && start && end) {
      duration = (end.getTime() - start.getTime()) / 60000;
    }
    if (typeof duration === 'number') {
      totalDuration += duration;
      durationCount += 1;
    }
    const trendDate = start ?? data.date?.toDate?.();
    if (trendDate && trendDate >= weekStart) {
      const k = trendDate.toISOString().slice(0, 10);
      weeklyMap[k] = (weeklyMap[k] || 0) + 1;
    }
  });

  const sessionsByPsychologist = Object.entries(sessionCount).map(([name, sessions]) => ({
    name,
    sessions,
  }));

  const avgDuration = durationCount ? totalDuration / durationCount : 0;
  const weeklySessions = Object.entries(weeklyMap)
    .map(([day, total]) => ({ day, total }))
    .sort((a, b) => a.day.localeCompare(b.day));

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold font-headline">Analytics</h1>
      <Charts
        userRoles={userRoles}
        appointments={appointments}
        notifications={notifications}
        sessionsByPsychologist={sessionsByPsychologist}
        weeklySessions={weeklySessions}
      />
      <div className="max-w-xs">
        <StatsCard
          title="Duração Média da Sessão"
          value={`${avgDuration.toFixed(1)} min`}
          icon={<Clock className="text-primary" />}
        />
      </div>
    </main>
  );
}

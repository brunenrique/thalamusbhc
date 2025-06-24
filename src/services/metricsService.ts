import {
  Firestore,
  collection,
  getCountFromServer,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS } from '@/lib/firestore-collections';
import { startOfMonth, endOfMonth } from 'date-fns';
import { USER_ROLES } from '@/constants/roles';

export async function getTotalPatients(firestore: Firestore = db): Promise<number> {
  const patientsColl = collection(firestore, FIRESTORE_COLLECTIONS.PATIENTS);
  const snapshot = await getCountFromServer(patientsColl);
  return snapshot.data().count;
}

export async function getSessionsInPeriod(
  from: Date,
  to: Date,
  firestore: Firestore = db
): Promise<number> {
  const appointments = collection(firestore, FIRESTORE_COLLECTIONS.APPOINTMENTS);
  const q = query(
    appointments,
    where('startDate', '>=', Timestamp.fromDate(from)),
    where('startDate', '<=', Timestamp.fromDate(to))
  );
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

export async function getSessionsThisMonth(firestore: Firestore = db): Promise<number> {
  const now = new Date();
  return getSessionsInPeriod(startOfMonth(now), endOfMonth(now), firestore);
}

export async function getTotalPsychologists(firestore: Firestore = db): Promise<number> {
  const usersColl = collection(firestore, FIRESTORE_COLLECTIONS.USERS);
  const q = query(
    usersColl,
    where('role', '==', USER_ROLES.PSYCHOLOGIST),
    where('isApproved', '==', true)
  );
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

export async function getOpenTasksCount(firestore: Firestore = db): Promise<number> {
  const q = query(
    collection(firestore, FIRESTORE_COLLECTIONS.TASKS),
    where('status', '!=', 'Concluída')
  );
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

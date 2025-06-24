import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import {
  Firestore,
  setDoc,
  doc,
  Timestamp,
  getCountFromServer,
  collection,
} from 'firebase/firestore';
import { getTotalPatients, getSessionsThisMonth } from '@/services/metricsService';

let testEnv: Awaited<ReturnType<typeof initializeTestEnvironment>>;

beforeAll(async () => {
  const hostPort = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8084';
  const [host, portStr] = hostPort.split(':');
  const port = parseInt(portStr, 10);

  testEnv = await initializeTestEnvironment({
    projectId: 'demo-project',
    firestore: {
      host,
      port,
      rules: readFileSync('firestore.rules', 'utf8'),
    },
  });
});

afterAll(async () => {
  if (testEnv) await testEnv.cleanup();
});

function getAuthedDb(
  auth: { uid: string; role: string; sessionsAggAllowed?: boolean }
): Firestore {
  return testEnv.authenticatedContext(auth.uid, auth).firestore();
}

test('count patients and sessions', async () => {
  const auth = { uid: 'admin', role: 'Admin' };
  const db = getAuthedDb(auth);

  await setDoc(doc(db, 'patients/p1'), { ownerId: 'admin', name: 'Test', email: 't@e.st' });
  await setDoc(doc(db, 'appointments/a1'), {
    startDate: Timestamp.fromDate(new Date()),
    status: 'Scheduled',
  });

  const patients = await getTotalPatients(db);
  const sessions = await getSessionsThisMonth(db);

  expect(patients).toBe(1);
  expect(sessions).toBe(1);
});

test('psychologist without permission cannot aggregate sessions', async () => {
  const auth = { uid: 'psy1', role: 'Psychologist' };
  const db = getAuthedDb(auth);
  await setDoc(doc(db, 'sessions/s1'), { psychologistId: 'psy1' });
  await assertFails(getCountFromServer(collection(db, 'sessions')));
});

test('psychologist with permission can aggregate sessions', async () => {
  const auth = { uid: 'psy2', role: 'Psychologist', sessionsAggAllowed: true };
  const db = getAuthedDb(auth);
  await assertSucceeds(getCountFromServer(collection(db, 'sessions')));
});

test('admin can aggregate sessions', async () => {
  const auth = { uid: 'admin2', role: 'Admin' };
  const db = getAuthedDb(auth);
  await assertSucceeds(getCountFromServer(collection(db, 'sessions')));
});

import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { Firestore, setDoc, doc, Timestamp } from 'firebase/firestore';
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

function getAuthedDb(auth: { uid: string; role: string }): Firestore {
  return testEnv.authenticatedContext(auth.uid, auth).firestore();
}

test('count patients and sessions', async () => {
  const auth = { uid: 'admin', role: 'Admin' };
  const db = getAuthedDb(auth);

  await setDoc(doc(db, 'patients/p1'), { ownerId: 'admin', name: 'Test' });
  await setDoc(doc(db, 'appointments/a1'), {
    startDate: Timestamp.fromDate(new Date()),
    status: 'Scheduled',
  });

  const patients = await getTotalPatients(db);
  const sessions = await getSessionsThisMonth(db);

  expect(patients).toBe(1);
  expect(sessions).toBe(1);
});

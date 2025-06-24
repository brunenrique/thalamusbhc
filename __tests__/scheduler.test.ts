import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { Firestore, doc, setDoc } from 'firebase/firestore';

let checkScheduleConflict: any;
let testEnv: Awaited<ReturnType<typeof initializeTestEnvironment>>;

beforeAll(async () => {
  const hostPort = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8085';
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

  const auth = { uid: 'psy1', role: 'Psychologist' };
  const db = testEnv.authenticatedContext(auth.uid, auth).firestore();

  jest.doMock('../src/lib/firebase', () => ({
    db,
  }));

  ({ checkScheduleConflict } = await import('../src/lib/scheduler'));
});

afterAll(async () => {
  if (testEnv) await testEnv.cleanup();
  jest.resetModules();
});

function getDb(auth: { uid: string; role: string }): Firestore {
  return testEnv.authenticatedContext(auth.uid, auth).firestore();
}

test('detects conflict with existing appointment', async () => {
  const auth = { uid: 'psy1', role: 'Psychologist' };
  const db = getDb(auth);
  await setDoc(doc(db, 'appointments/a1'), {
    psychologistId: auth.uid,
    appointmentDate: '2024-01-01',
    startTime: '09:00',
    endTime: '10:00',
    type: 'Consulta',
    status: 'Scheduled',
  });

  const conflict = await checkScheduleConflict(
    {
      appointmentDate: '2024-01-01',
      startTime: '09:30',
      endTime: '10:30',
      psychologistId: auth.uid,
    },
    db
  );
  expect(conflict).toBe(true);
});

test('block slot logic', async () => {
  const auth = { uid: 'psy1', role: 'Psychologist' };
  const db = getDb(auth);
  await setDoc(doc(db, 'appointments/block1'), {
    psychologistId: auth.uid,
    appointmentDate: '2024-01-01',
    startTime: '13:00',
    endTime: '14:00',
    type: 'Blocked Slot',
    status: 'Blocked',
  });

  const conflictForPatient = await checkScheduleConflict(
    {
      appointmentDate: '2024-01-01',
      startTime: '13:30',
      endTime: '13:45',
      psychologistId: auth.uid,
    },
    db
  );
  expect(conflictForPatient).toBe(true);

  const conflictForBlock = await checkScheduleConflict(
    {
      appointmentDate: '2024-01-01',
      startTime: '13:30',
      endTime: '13:45',
      psychologistId: auth.uid,
      isBlockTime: true,
    },
    db
  );
  expect(conflictForBlock).toBe(false);
});

test('detects conflict with group session', async () => {
  const auth = { uid: 'psy1', role: 'Psychologist' };
  const db = getDb(auth);
  await setDoc(doc(db, 'groups/g1'), {
    psychologistId: auth.uid,
    dayOfWeek: 'monday',
    startTime: '15:00',
    endTime: '16:00',
  });

  const conflict = await checkScheduleConflict(
    {
      appointmentDate: '2024-01-01',
      startTime: '15:30',
      endTime: '16:00',
      psychologistId: auth.uid,
    },
    db
  );
  expect(conflict).toBe(true);
});

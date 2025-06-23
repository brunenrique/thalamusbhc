import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { Firestore, getDocs, collection } from 'firebase/firestore';
import { saveSessionNote } from '../src/services/prontuarioService';
import { createAppointment } from '../src/services/appointmentService';
import { setEncryptionPassword } from '../src/lib/encryptionKey';

let testEnv: Awaited<ReturnType<typeof initializeTestEnvironment>>;

beforeAll(async () => {
  const hostPort = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8083';
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

function getDb(auth: { uid: string; role: string }): Firestore {
  return testEnv.authenticatedContext(auth.uid, auth).firestore();
}

test('audit log created for session note and appointment', async () => {
  const auth = { uid: 'therapist1', role: 'Psychologist' };
  const db = getDb(auth);
  setEncryptionPassword('senha');

  const noteId = await saveSessionNote(db, 'patient1', 'text', auth.uid);
  expect(noteId).toBeDefined();

  const apptId = await createAppointment(
    {
      appointmentDate: '2024-01-01',
      startTime: '10:00',
      endTime: '11:00',
      psychologistId: auth.uid,
      patientId: 'patient1',
      type: 'Consulta',
    },
    db,
  );
  expect(apptId).toBeDefined();

  const logsSnap = await getDocs(collection(db, 'auditLogs'));
  expect(logsSnap.size).toBe(2);
});

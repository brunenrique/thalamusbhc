import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { Firestore, getDocs, collection } from 'firebase/firestore';
import { saveSessionNote } from '../src/services/prontuarioService';
import { createAppointment } from '../src/services/appointmentService';

let createPatient: any;
let updatePatient: any;
let createAssessment: any;
let submitAssessmentResponses: any;
import { setEncryptionPassword } from '../src/lib/encryptionKey';

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

  const auth = { uid: 'therapist1', role: 'Psychologist' };
  const db = testEnv.authenticatedContext(auth.uid, auth).firestore();

  jest.doMock('../src/lib/firebase', () => ({
    db,
    auth: { currentUser: { uid: auth.uid } },
  }));

  ({ createPatient, updatePatient } = await import('../src/services/patientService'));
  ({ createAssessment, submitAssessmentResponses } = await import(
    '../src/services/assessmentService'
  ));
});

afterAll(async () => {
  if (testEnv) await testEnv.cleanup();
  jest.resetModules();
});

function getDb(auth: { uid: string; role: string }): Firestore {
  return testEnv.authenticatedContext(auth.uid, auth).firestore();
}

test('audit log created for multiple actions', async () => {
  const auth = { uid: 'therapist1', role: 'Psychologist' };
  const db = getDb(auth);
  setEncryptionPassword('senha');

  const patientId = await createPatient({ name: 'Ana', email: 'a@b.com' }, db);
  expect(patientId).toBeDefined();

  await updatePatient(patientId, { name: 'Ana', email: 'a@b.com' }, db);

  const noteId = await saveSessionNote(db, patientId, 'text', auth.uid);
  expect(noteId).toBeDefined();

  const apptId = await createAppointment(
    {
      appointmentDate: '2024-01-01',
      startTime: '10:00',
      endTime: '11:00',
      psychologistId: auth.uid,
      patientId,
      type: 'Consulta',
    },
    db
  );
  expect(apptId).toBeDefined();

  const assessmentId = await createAssessment(
    {
      patientId,
      templateId: 't1',
      templateName: 't1',
      assignedBy: auth.uid,
      status: 'assigned',
    },
    db
  );
  expect(assessmentId).toBeDefined();

  await submitAssessmentResponses(assessmentId, { q1: 'a' }, db);

  const logsSnap = await getDocs(collection(db, 'auditLogs'));
  expect(logsSnap.size).toBe(6);
});

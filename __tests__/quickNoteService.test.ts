import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { Firestore } from 'firebase/firestore';

let createQuickNote: any;
let getQuickNotes: any;

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

  ({ createQuickNote, getQuickNotes } = await import('../src/services/quickNoteService'));
});

afterAll(async () => {
  if (testEnv) await testEnv.cleanup();
  jest.resetModules();
});

function getDb(auth: { uid: string; role: string }): Firestore {
  return testEnv.authenticatedContext(auth.uid, auth).firestore();
}

test('salva e carrega quick notes', async () => {
  const auth = { uid: 'therapist1', role: 'Psychologist' };
  const db = getDb(auth);
  const patientId = 'p1';
  const noteId = await createQuickNote(patientId, { text: 'olá' }, db);
  expect(noteId).toBeDefined();

  const notes = await getQuickNotes(patientId, db);
  expect(notes.length).toBe(1);
  expect(notes[0].text).toBe('olá');
});

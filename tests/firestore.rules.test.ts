import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { setDoc, doc } from 'firebase/firestore';

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
});

afterAll(async () => {
  if (testEnv) await testEnv.cleanup();
});

function dbFor(auth?: { uid: string; role: string }) {
  return auth
    ? testEnv.authenticatedContext(auth.uid, auth).firestore()
    : testEnv.unauthenticatedContext().firestore();
}

test('psychologist manages own patient', async () => {
  const psy = { uid: 'psy1', role: 'Psychologist' };
  const psyDb = dbFor(psy);
  const ref = doc(psyDb, 'patients/p1');
  await assertSucceeds(setDoc(ref, { ownerId: psy.uid, name: 'Test', email: 't@e.st' }));
  await assertSucceeds(ref.get());

  const otherDb = dbFor({ uid: 'psy2', role: 'Psychologist' });
  await assertFails(otherDb.doc('patients/p1').get());
});

test('secretary can create appointment but not read notes', async () => {
  const sec = { uid: 'sec1', role: 'Secretary' };
  const secDb = dbFor(sec);
  await assertSucceeds(setDoc(doc(secDb, 'appointments/a1'), { psychologistId: sec.uid }));
  await assertFails(secDb.doc('sessionNotes/n1').get());
});

test('admin has full access', async () => {
  const adminDb = dbFor({ uid: 'admin1', role: 'Admin' });
  await assertSucceeds(
    setDoc(doc(adminDb, 'sessionNotes/n2'), {
      ownerId: 'admin1',
      patientId: 'p',
      createdAt: new Date(),
      data: { ciphertext: '', iv: '', tag: '' },
    })
  );
  await assertSucceeds(adminDb.doc('patients/p1').get());
});

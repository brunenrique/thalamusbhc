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
    firestore: { host, port, rules: readFileSync('firestore.rules', 'utf8') },
  });
});

afterAll(async () => {
  if (testEnv) await testEnv.cleanup();
});

function dbFor(auth: { uid: string; role: string }) {
  return testEnv.authenticatedContext(auth.uid, auth).firestore();
}

test('user can manage own dashboard layout', async () => {
  const user = { uid: 'u1', role: 'Psychologist' } as const;
  const db = dbFor(user);
  const ref = doc(db, 'users/u1/preferences/dashboardLayout');
  await assertSucceeds(setDoc(ref, { widgets: [] }));
  await assertSucceeds(ref.get());
});

test('user cannot modify others preferences', async () => {
  const other = { uid: 'u2', role: 'Psychologist' } as const;
  const db = dbFor(other);
  await assertFails(setDoc(doc(db, 'users/u1/preferences/dashboardLayout'), { widgets: [] }));
});

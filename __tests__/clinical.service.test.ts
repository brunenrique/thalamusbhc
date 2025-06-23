import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { Firestore } from 'firebase/firestore';

let fetchClinicalData: any;
let saveClinicalData: any;

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

  const auth = { uid: 'therapist1', role: 'Psychologist' };
  const db = testEnv.authenticatedContext(auth.uid, auth).firestore();

  jest.doMock('../src/lib/firebase', () => ({
    db,
    auth: { currentUser: { uid: auth.uid } },
  }));

  ({ fetchClinicalData, saveClinicalData } = await import('../src/services/clinicalService'));
});

afterAll(async () => {
  if (testEnv) await testEnv.cleanup();
  jest.resetModules();
});

function getDb(auth: { uid: string; role: string }): Firestore {
  return testEnv.authenticatedContext(auth.uid, auth).firestore();
}

test('salva e busca clinical data', async () => {
  const auth = { uid: 'therapist1', role: 'Psychologist' };
  const db = getDb(auth);
  const patientId = 'p1';
  const tabId = 't1';

  await saveClinicalData(patientId, tabId, { nodes: [1] } as any, db);

  const data = await fetchClinicalData(patientId, tabId, db);
  expect(data).not.toBeNull();
  expect((data as any).nodes).toEqual([1]);
});

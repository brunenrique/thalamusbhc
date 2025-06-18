import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { Firestore } from 'firebase/firestore';
import fetch from 'node-fetch';

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

function getAuthedDb(auth: { sub: string; role: string }): Firestore {
  return testEnv.authenticatedContext(auth.sub, auth).firestore();
}

describe('Patient Rules Tests', () => {

  test('owner can read and write patient document', async () => {
    const auth = { uid: 'user1' };
    const db = testEnv.authenticatedContext(auth.uid).firestore();
    const patientDoc = db.collection('patients').doc('patient1');

    await assertSucceeds(patientDoc.set({ ownerId: auth.uid, name: 'Test Patient' }));
    await assertSucceeds(patientDoc.get());
  });

  test('non-owner cannot read or write patient document', async () => {
    // Create a patient document owned by user1
    const ownerAuth = { uid: 'user1' };
    const ownerDb = testEnv.authenticatedContext(ownerAuth.uid).firestore();
    const ownerDoc = ownerDb.collection('patients').doc('patient2');
    await assertSucceeds(ownerDoc.set({ ownerId: ownerAuth.uid, name: 'Test Patient' }));

    // Try to access it as another user
    const otherAuth = { uid: 'user2' };
    const otherDb = testEnv.authenticatedContext(otherAuth.uid).firestore();
    const otherDoc = otherDb.collection('patients').doc('patient2');

    await assertFails(otherDoc.get());
    await assertFails(otherDoc.set({ ownerId: otherAuth.uid, name: 'Should Fail' }));
  });
});
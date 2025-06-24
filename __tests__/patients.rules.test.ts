import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { encrypt } from '../src/lib/crypto-utils';
import { deriveKeyFromPassword } from '../src/lib/encryptionKey';

const key = deriveKeyFromPassword('test-pass');

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

describe('Patient Rules Tests', () => {
  test('psychologist can read and write own patient document', async () => {
    const auth = { uid: 'user1' };
    const db = testEnv.authenticatedContext(auth.uid).firestore();
    const patientDoc = db.collection('patients').doc('patient1');

    await assertSucceeds(
      patientDoc.set({
        ownerId: auth.uid,
        name: 'Test Patient',
        email: 'test@example.com',
        phoneEnc: encrypt('123', key),
      })
    );
    await assertSucceeds(patientDoc.get());
  });

  test('other psychologist cannot access patient document', async () => {
    const ownerAuth = { uid: 'user1' };
    const ownerDb = testEnv.authenticatedContext(ownerAuth.uid).firestore();
    const ownerDoc = ownerDb.collection('patients').doc('patient2');
    await assertSucceeds(
      ownerDoc.set({ ownerId: ownerAuth.uid, name: 'Test Patient', email: 'a@b.c' })
    );

    const otherAuth = { uid: 'user2' };
    const otherDb = testEnv.authenticatedContext(otherAuth.uid).firestore();
    const otherDoc = otherDb.collection('patients').doc('patient2');

    await assertFails(otherDoc.get());
    await assertFails(
      otherDoc.set({ ownerId: otherAuth.uid, name: 'Should Fail', email: 'x@y.z' })
    );
  });

  test('unauthenticated user cannot access patient document', async () => {
    const patientDoc = testEnv
      .unauthenticatedContext()
      .firestore()
      .collection('patients')
      .doc('patient3');
    await assertFails(patientDoc.get());
    await assertFails(patientDoc.set({ ownerId: 'someone', name: 'Nope', email: 'n@o.pe' }));
  });
});

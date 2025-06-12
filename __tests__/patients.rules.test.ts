/** @jest-environment node */
import { initializeTestEnvironment, assertFails, assertSucceeds, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { doc, setDoc, getDoc } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-project',
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

async function createPatient(id: string, ownerId: string) {
  await testEnv.withSecurityRulesDisabled(async context => {
    await setDoc(doc(context.firestore(), `patients/${id}`), { ownerId, name: 'test' });
  });
}

test('owner can read and write patient document', async () => {
  await createPatient('p1', 'user1');
  const ownerDb = testEnv.authenticatedContext('user1').firestore();
  await assertSucceeds(getDoc(doc(ownerDb, 'patients/p1')));
  await assertSucceeds(setDoc(doc(ownerDb, 'patients/p1'), { age: 30 }, { merge: true }));
});

test('non-owner cannot read or write patient document', async () => {
  await createPatient('p2', 'user1');
  const otherDb = testEnv.authenticatedContext('user2').firestore();
  await assertFails(getDoc(doc(otherDb, 'patients/p2')));
  await assertFails(setDoc(doc(otherDb, 'patients/p2'), { age: 40 }, { merge: true }));
});

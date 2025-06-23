import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';
import { Firestore } from 'firebase/firestore';
import { readFileSync } from 'fs'; // <- ESSENCIAL!

let testEnv: Awaited<ReturnType<typeof initializeTestEnvironment>>;

describe('Firestore security rules', () => {
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
  });

  afterAll(async () => {
    if (testEnv) await testEnv.cleanup();
  });

  function getAuthedDb(auth: { sub: string; role: string }): Firestore {
    return testEnv.authenticatedContext(auth.sub, auth).firestore();
  }

  test('admin user can read other user profile', async () => {
    const auth = { sub: 'user-id', role: 'Admin' };
    const db = getAuthedDb(auth);
    await assertSucceeds(db.doc('users/otherUser').get());
  });

  test('authenticated user can create assessment', async () => {
    const auth = { sub: 'therapist1', role: 'psychologist' };
    const db = getAuthedDb(auth);
    await assertSucceeds(
      db.doc('assessments/testAssessment').set({
        patientId: 'patient1',
        assignedBy: auth.sub,
        templateId: 'tpl1',
        templateName: 'Demo',
        status: 'assigned',
        createdAt: '2024-01-01T00:00:00Z',
      })
    );
  });

  describe('Appointment Rules', () => {
    test('non participant cannot read appointment', async () => {
      const psyAuth = { sub: 'psy1', role: 'Psychologist' };
      const otherAuth = { uid: 'other' };
      const psyDb = getAuthedDb(psyAuth);
      const otherDb = testEnv.authenticatedContext(otherAuth.uid).firestore();

      const docRef = psyDb.collection('appointments').doc('appt1');
      await assertSucceeds(docRef.set({ psychologistId: psyAuth.sub, patientId: 'pat1' }));

      await assertFails(otherDb.collection('appointments').doc('appt1').get());
      await assertFails(otherDb.collection('appointments').doc('appt1').update({ notes: 'x' }));
    });

    test('unauthenticated user cannot create appointment', async () => {
      const db = testEnv.unauthenticatedContext().firestore();
      await assertFails(
        db.collection('appointments').doc('appt2').set({ psychologistId: 'p', patientId: 'pat1' })
      );
      await assertFails(db.collection('appointments').doc('appt1').get());
    });

    test('psychologist can manage own appointment', async () => {
      const psyAuth = { sub: 'psy2', role: 'Psychologist' };
      const db = getAuthedDb(psyAuth);
      const docRef = db.collection('appointments').doc('apptManage');

      await assertSucceeds(docRef.set({ psychologistId: psyAuth.sub, patientId: 'pat2' }));
      await assertSucceeds(docRef.update({ notes: 'x' }));
      await assertSucceeds(docRef.delete());
    });

    test('patient can read own appointment but cannot modify', async () => {
      const psyAuth = { sub: 'psy3', role: 'Psychologist' };
      const psyDb = getAuthedDb(psyAuth);
      const docRef = psyDb.collection('appointments').doc('apptPatient');
      await assertSucceeds(docRef.set({ psychologistId: psyAuth.sub, patientId: 'patRead' }));

      const patientDb = testEnv.authenticatedContext('patRead').firestore();
      await assertSucceeds(patientDb.collection('appointments').doc('apptPatient').get());
      await assertFails(patientDb.collection('appointments').doc('apptPatient').update({ foo: 'bar' }));
      await assertFails(patientDb.collection('appointments').doc('apptPatient').delete());
    });
  });
});

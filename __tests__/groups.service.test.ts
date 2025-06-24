import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { Firestore } from 'firebase/firestore';

let createGroup: any;
let fetchGroups: any;
let updateGroup: any;
let deleteGroup: any;

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

  ({ createGroup, fetchGroups, updateGroup, deleteGroup } = await import(
    '../src/services/groupService'
  ));
});

afterAll(async () => {
  if (testEnv) await testEnv.cleanup();
  jest.resetModules();
});

function getDb(auth: { uid: string; role: string }): Firestore {
  return testEnv.authenticatedContext(auth.uid, auth).firestore();
}

test('create, update and delete group', async () => {
  const auth = { uid: 'therapist1', role: 'Psychologist' };
  const db = getDb(auth);

  const groupId = await createGroup(
    {
      name: 'Grupo Teste',
      psychologistId: auth.uid,
      patientIds: ['p1', 'p2'],
      dayOfWeek: 'monday',
      startTime: '10:00',
      endTime: '11:00',
    },
    db
  );

  let groups = await fetchGroups(db);
  expect(groups.length).toBe(1);
  expect(groups[0].id).toBe(groupId);

  await updateGroup(groupId, { endTime: '11:30' }, db);
  groups = await fetchGroups(db);
  expect(groups[0].endTime).toBe('11:30');

  await deleteGroup(groupId, db);
  groups = await fetchGroups(db);
  expect(groups.length).toBe(0);
});

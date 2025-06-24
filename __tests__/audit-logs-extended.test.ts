import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { Firestore, getDocs, collection } from 'firebase/firestore';
import { USER_ROLES } from '@/constants/roles';

let createTask: any;
let updateTask: any;
let deleteTaskFunc: any;
let createWaitingListEntry: any;
let updateWaitingListEntry: any;
let deleteWaitingListEntry: any;
let addNotification: any;
let markNotificationRead: any;
let deleteNotification: any;
let markAllNotificationsRead: any;
let clearReadNotifications: any;

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

  const auth = { uid: 'therapist1', role: USER_ROLES.PSYCHOLOGIST } as const;
  const db = testEnv.authenticatedContext(auth.uid, auth).firestore();

  jest.doMock('../src/lib/firebase', () => ({
    db,
    auth: { currentUser: { uid: auth.uid } },
  }));

  ({
    createTask,
    updateTask,
    deleteTask: deleteTaskFunc,
  } = await import('../src/services/taskService'));
  ({ createWaitingListEntry, updateWaitingListEntry, deleteWaitingListEntry } = await import(
    '../src/services/waitingListService'
  ));
  ({
    addNotification,
    markNotificationRead,
    deleteNotification,
    markAllNotificationsRead,
    clearReadNotifications,
  } = await import('../src/services/notificationService'));
});

afterAll(async () => {
  if (testEnv) await testEnv.cleanup();
  jest.resetModules();
});

function getDb(auth: { uid: string; role: string }): Firestore {
  return testEnv.authenticatedContext(auth.uid, auth).firestore();
}

test('audit log created for tasks, waiting list and notifications', async () => {
  const auth = { uid: 'therapist1', role: USER_ROLES.PSYCHOLOGIST } as const;
  const db = getDb(auth);

  // Tasks
  const taskId = await createTask(
    {
      title: 'T1',
      dueDate: '2024-01-01',
      assignedTo: auth.uid,
      status: 'Pendente',
      priority: 'Alta',
    },
    db
  );
  await updateTask(taskId, { status: 'Concluída' }, db);
  await deleteTaskFunc(taskId, db);

  // Waiting list
  const wId = await createWaitingListEntry({ name: 'P1', priority: 'Média' }, db);
  await updateWaitingListEntry(wId, { notes: 'ok' }, db);
  await deleteWaitingListEntry(wId, db);

  // Notifications
  const n1 = await addNotification(
    auth.uid,
    { type: 'info', message: 'm1', date: new Date().toISOString(), read: false },
    db
  );
  await markNotificationRead(auth.uid, n1, true, db);
  await markAllNotificationsRead(auth.uid, db);
  await clearReadNotifications(auth.uid, db);
  const n2 = await addNotification(
    auth.uid,
    { type: 'info', message: 'm2', date: new Date().toISOString(), read: false },
    db
  );
  await deleteNotification(auth.uid, n2, db);

  const logsSnap = await getDocs(collection(db, 'auditLogs'));
  expect(logsSnap.size).toBe(12);
});

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const scheduleReminders = functions.pubsub.schedule('every 1 hours').onRun(async () => {
  const now = admin.firestore.Timestamp.now();
  const tomorrow = admin.firestore.Timestamp.fromMillis(now.toMillis() + 24 * 60 * 60 * 1000);

  const appointments = await db
    .collection('appointments')
    .where('startDate', '>=', now)
    .where('startDate', '<=', tomorrow)
    .get();

  const tasks = await db
    .collection('tasks')
    .where('dueDate', '>=', now)
    .where('dueDate', '<=', tomorrow)
    .where('status', '!=', 'Concluída')
    .get();

  const messaging = admin.messaging();

  const sendToUser = async (userId: string, payload: admin.messaging.MessagingPayload) => {
    const tokensSnap = await db.collection('users').doc(userId).collection('fcmTokens').get();
    const tokens = tokensSnap.docs.map((d) => d.id);
    if (tokens.length) {
      await messaging.sendEachForMulticast({ tokens, ...payload });
    }
  };

  await Promise.all(
    appointments.docs.map(async (doc) => {
      const data = doc.data();
      await sendToUser(data.userId, {
        notification: {
          title: 'Lembrete de Agendamento',
          body: `Você tem um agendamento amanhã às ${data.startTime}`,
        },
        data: { type: 'appointment_reminder', id: doc.id },
      });
    })
  );

  await Promise.all(
    tasks.docs.map(async (doc) => {
      const data = doc.data();
      await sendToUser(data.assignedTo, {
        notification: {
          title: 'Lembrete de Tarefa',
          body: `A tarefa "${data.title}" vence amanhã.`,
        },
        data: { type: 'task_due', id: doc.id },
      });
    })
  );
});

export const healthcheck = functions.https.onRequest((_, res) => {
  res.status(200).send('ok');
});

export { setRoleOnCreate } from './auth';

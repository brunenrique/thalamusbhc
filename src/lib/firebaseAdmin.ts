import admin from 'firebase-admin';
import { loadSecrets } from './secretManager';

await loadSecrets(['FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY']);

const app =
  admin.apps[0] ??
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });

export const firestoreAdmin = app.firestore();

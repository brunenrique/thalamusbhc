import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const adminApp = getApps().length ? getApp() : initializeApp();

export const adminDb = getFirestore(adminApp);

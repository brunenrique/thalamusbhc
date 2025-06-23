
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import * as Sentry from '@sentry/nextjs';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, type FirebaseStorage } from 'firebase/storage';
import { getMessaging, type Messaging } from 'firebase/messaging';
import logger from '@/lib/logger';
// Para Functions, se for usar diretamente no cliente no futuro:
// import { getFunctions, connectFunctionsEmulator, type Functions } from 'firebase/functions';

let firebaseConfig;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (process.env.NODE_ENV === 'development') {
  // Configuração para desenvolvimento, priorizando o uso de emuladores.
  // Usamos placeholders para a maioria das chaves, mas tentamos usar o projectId real se disponível.
  firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX_placeholder", // Placeholder API Key
    authDomain: `${projectId || 'demo-psiguard'}.firebaseapp.com`,
    projectId: projectId || "demo-psiguard", // Use o Project ID real se configurado, ou um placeholder
    storageBucket: `${projectId || 'demo-psiguard'}.appspot.com`,
    messagingSenderId: "000000000000_placeholder", // Placeholder
    appId: "1:000000000000:web:placeholderxxxxxxxxxxxxxx", // Placeholder
  };
  logger.info({ action: 'init_firebase_dev' });
} else {
  // Configuração de Produção
  firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);
let messaging: Messaging | null = null;
if (typeof window !== 'undefined') {
  messaging = getMessaging(app);
}
// const functions: Functions = getFunctions(app); // Descomente se for usar Functions no cliente

if (process.env.NODE_ENV === 'development') {
  logger.info({ action: 'connect_emulators_start' });
  try {
    // Use 'localhost' as a fallback, as '127.0.0.1' can sometimes be tricky in containerized/proxied environments.
    const host = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST || 'localhost';
    
    const authPort = 9099;
    connectAuthEmulator(auth, `http://${host}:${authPort}`, { disableWarnings: true });
    logger.info({ action: 'auth_emulator_connected', meta: { host, port: authPort } });

    const firestorePort = 8084;
    connectFirestoreEmulator(db, host, firestorePort);
    logger.info({ action: 'firestore_emulator_connected', meta: { host, port: firestorePort } });

    const storagePort = 9200;
    connectStorageEmulator(storage, host, storagePort);
    logger.info({ action: 'storage_emulator_connected', meta: { host, port: storagePort } });

    // Functions Emulator (se necessário)
    // const functionsPort = 5001;
    // connectFunctionsEmulator(functions, host, functionsPort);
    // console.info(`Functions Emulator connected to ${host}:${functionsPort}`);
    
  } catch (error) {
    Sentry.captureException(error);
    logger.error({ action: 'emulator_connect_error', meta: { error } });
  }
}

export { app, auth, db, storage, messaging };
    

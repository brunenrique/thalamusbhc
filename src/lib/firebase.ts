
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, type FirebaseStorage } from 'firebase/storage';
import { getMessaging, type Messaging } from 'firebase/messaging';
// Para Functions, se for usar diretamente no cliente no futuro:
// import { getFunctions, connectFunctionsEmulator, type Functions } from 'firebase/functions';

let firebaseConfig;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const inDevelopment = process.env.NODE_ENV === 'development';
const emulatorHost = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST || '127.0.0.1';

if (inDevelopment) {
  // Configuração para desenvolvimento, priorizando o uso de emuladores.
  firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX_placeholder", 
    authDomain: `${projectId || 'demo-psiguard'}.firebaseapp.com`,
    projectId: projectId || "demo-psiguard", 
    storageBucket: `${projectId || 'demo-psiguard'}.appspot.com`,
    messagingSenderId: "000000000000_placeholder", 
    appId: "1:000000000000:web:placeholderxxxxxxxxxxxxxx", 
  };
  console.info('Development mode: Initializing Firebase with placeholder config before connecting to emulators.');
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
// const functions: Functions = getFunctions(app); 

if (inDevelopment) {
  console.info(`Development mode: Attempting to connect to Firebase Emulators at host: ${emulatorHost}...`);
  try {
    connectAuthEmulator(auth, `http://${emulatorHost}:9099`, { disableWarnings: true });
    console.info(`Auth Emulator connected to http://${emulatorHost}:9099`);

    connectFirestoreEmulator(db, emulatorHost, 8083);
    console.info(`Firestore Emulator connected to ${emulatorHost}:8083`);

    connectStorageEmulator(storage, emulatorHost, 9199);
    console.info(`Storage Emulator connected to ${emulatorHost}:9199`);
    
  } catch (error) {
    console.error('Error connecting to Firebase Emulators:', error);
  }
}

export { app, auth, db, storage, messaging }; 
    

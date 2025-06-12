const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const path = require('path');
const fs = require('fs').promises;

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore();
const storage = getStorage().bucket();

async function exportCollection(name) {
  const snap = await db.collection(name).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function run() {
  const date = new Date().toISOString().slice(0, 10);
  const dir = path.join('/tmp', 'backups', date);
  await fs.mkdir(dir, { recursive: true });

  const data = {};
  for (const col of ['patients', 'sessionNotes']) {
    data[col] = await exportCollection(col);
    await fs.writeFile(path.join(dir, `${col}.json`), JSON.stringify(data[col], null, 2));
  }

  await storage.upload(path.join(dir, 'patients.json'), { destination: `backups/${date}/patients.json` });
  await storage.upload(path.join(dir, 'sessionNotes.json'), { destination: `backups/${date}/sessionNotes.json` });
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

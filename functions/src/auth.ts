import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

export const setRoleOnSignUp = functions.auth.user().onCreate(async (user) => {
  const role = user.email?.endsWith('@myclinic.com') ? 'Admin' : 'Psychologist';
  await admin.auth().setCustomUserClaims(user.uid, { role });
});

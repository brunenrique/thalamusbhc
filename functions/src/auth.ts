import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

export const setRoleOnSignUp = functions.auth.user().onCreate(async (user) => {
  const role = user.email?.endsWith('@myclinic.com') ? 'Admin' : 'Psychologist';
  try {
    await admin.auth().setCustomUserClaims(user.uid, { role });
    functions.logger.info('Assigned role on sign up', { uid: user.uid, role });
  } catch (e) {
    functions.logger.error('Failed to set custom claims', { uid: user.uid, error: e });
    throw new functions.https.HttpsError('internal', 'Unable to set user role');
  }
});

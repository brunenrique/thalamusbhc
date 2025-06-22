import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const setRoleOnCreate = functions.auth.user().onCreate(async (user) => {
  const role: 'Admin' | 'Psychologist' | 'Secretary' = 'Psychologist';
  try {
    await admin.auth().setCustomUserClaims(user.uid, { role });
    functions.logger.info('Role set on user creation', { uid: user.uid, role });
  } catch (e) {
    functions.logger.error('Failed to set role', e as Error);
    throw new functions.https.HttpsError('internal', 'Unable to set user role');
  }
});

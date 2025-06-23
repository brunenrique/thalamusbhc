import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as Sentry from '@sentry/node';

export const setRoleOnCreate = functions.auth.user().onCreate(
  Sentry.wrap(async (user) => {
    const role: 'Admin' | 'Psychologist' | 'Secretary' = 'Psychologist';
    try {
      await admin.auth().setCustomUserClaims(user.uid, { role });
      functions.logger.info('Role set on user creation', { uid: user.uid, role });
      console.info({ userId: user.uid, action: 'set_role_on_create' });
    } catch (e) {
      Sentry.captureException(e);
      functions.logger.error('Failed to set role', e as Error);
      throw new functions.https.HttpsError('internal', 'Unable to set user role');
    }
  })
);

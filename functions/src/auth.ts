
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// admin.initializeApp(); // Initialization is likely handled in index.ts or elsewhere if this is the only function

// export const setRoleOnSignUp = functions.auth.user().onCreate(async (user) => {
//   // Auth is disabled in the main app, so this function may not be triggered
//   // or may cause issues if Firebase Auth is still active on the project.
//   // Commenting out the logic to prevent unintended side effects.
//   functions.logger.info('setRoleOnSignUp triggered, but auth is disabled in the app. No action taken for user:', user.uid);
//   /*
//   const role = user.email?.endsWith('@myclinic.com') ? 'Admin' : 'Psychologist';
//   try {
//     await admin.auth().setCustomUserClaims(user.uid, { role });
//     functions.logger.info('Assigned role on sign up', { uid: user.uid, role });
//   } catch (e) {
//     functions.logger.error('Failed to set custom claims', { uid: user.uid, error: e });
//     throw new functions.https.HttpsError('internal', 'Unable to set user role');
//   }
//   */
// });

// If this file only contained setRoleOnSignUp, it might be better to remove it
// or ensure no functions are exported if they are not intended to run.
// For now, just commenting out the function body.
// If admin.initializeApp() was here and nowhere else, other functions might break.
// Assuming index.ts handles initialization for other functions.

// To completely disable, you could export an empty object or nothing:
// export {};
// Or simply ensure this function is not deployed if not needed.

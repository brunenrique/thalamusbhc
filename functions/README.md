# Cloud Functions

This directory contains Firebase Cloud Functions for PsiGuard.

- `scheduleReminders` runs hourly and checks appointments and tasks that occur within the next 24 hours. Any matching records trigger push notifications to users via Firebase Cloud Messaging.
- The previous triggers `onCreateUser` and `setUserRole` were removed because authentication is currently disabled in the project.

## Deploy

Run the TypeScript build inside `functions/` and deploy:

```bash
cd functions && npm run build
firebase deploy --only functions
```

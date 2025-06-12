# Cloud Functions

This directory contains Firebase Cloud Functions for PsiGuard.

* `scheduleReminders` runs hourly and checks appointments and tasks that occur within the next 24 hours. Any matching records trigger push notifications to users via Firebase Cloud Messaging.
* `onCreateUser` triggers when a new Firebase Authentication user is created and assigns a custom claim `role`. Emails under the `@psiguard.app` domain become `Admin`; all others default to `Psychologist`.

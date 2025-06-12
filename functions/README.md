# Cloud Functions

This directory contains Firebase Cloud Functions for PsiGuard. The `scheduleReminders` function runs hourly and checks appointments and tasks that occur within the next 24 hours. Any matching records trigger push notifications to users via Firebase Cloud Messaging.

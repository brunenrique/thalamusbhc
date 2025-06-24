export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  PATIENTS: 'patients',
  APPOINTMENTS: 'appointments',
  ASSESSMENTS: 'assessments',
  TASKS: 'tasks',
  GROUPS: 'groups',
  WAITING_LIST: 'waitingList',
  CHATS: 'chats',
  NOTIFICATIONS: 'notifications',
  FCM_TOKENS: 'fcmTokens',
  MESSAGES: 'messages',
  BACKUP_SETTINGS: 'backupSettings',
  BACKUPS: 'backups',
  SESSION_NOTES: 'sessionNotes',
  QUICK_NOTES: 'quickNotes',
  SCHEDULES: 'schedules',
  AUDIT_LOGS: 'auditLogs',
  INSIGHTS_LOGS: 'insights_logs',
  CLINICAL_DATA: 'clinicalTabs',
  FEEDBACK: 'feedback',
} as const;

export type FirestoreCollectionKeys = keyof typeof FIRESTORE_COLLECTIONS;

export const USER_ROLES = {
  ADMIN: 'admin',
  PSYCHOLOGIST: 'psychologist',
  PATIENT: 'patient',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

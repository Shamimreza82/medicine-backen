export const authPermissions = [
  // PATIENT
  {
    name: 'PATIENT:CREATE',
    resource: 'PATIENT',
    action: 'CREATE',
    description: 'Create patient record',
  },
  { name: 'PATIENT:VIEW', resource: 'PATIENT', action: 'VIEW', description: 'View patient' },
  {
    name: 'PATIENT:UPDATE',
    resource: 'PATIENT',
    action: 'UPDATE',
    description: 'Update patient',
  },
  {
    name: 'PATIENT:DELETE',
    resource: 'PATIENT',
    action: 'DELETE',
    description: 'Delete patient',
  },
  {
    name: 'PATIENT:EXPORT',
    resource: 'PATIENT',
    action: 'EXPORT',
    description: 'Export patient list',
  },
  {
    name: 'PATIENT:IMPORT',
    resource: 'PATIENT',
    action: 'IMPORT',
    description: 'Import patients',
  },

  // APPOINTMENT
  {
    name: 'APPOINTMENT:CREATE',
    resource: 'APPOINTMENT',
    action: 'CREATE',
    description: 'Create appointment',
  },
  {
    name: 'APPOINTMENT:VIEW',
    resource: 'APPOINTMENT',
    action: 'VIEW',
    description: 'View appointment',
  },
  {
    name: 'APPOINTMENT:UPDATE',
    resource: 'APPOINTMENT',
    action: 'UPDATE',
    description: 'Update appointment',
  },
  {
    name: 'APPOINTMENT:CANCEL',
    resource: 'APPOINTMENT',
    action: 'CANCEL',
    description: 'Cancel appointment',
  },
  {
    name: 'APPOINTMENT:DELETE',
    resource: 'APPOINTMENT',
    action: 'DELETE',
    description: 'Delete appointment',
  },
  {
    name: 'APPOINTMENT:RESCHEDULE',
    resource: 'APPOINTMENT',
    action: 'RESCHEDULE',
    description: 'Reschedule appointment',
  },

  // PRESCRIPTION
  {
    name: 'PRESCRIPTION:CREATE',
    resource: 'PRESCRIPTION',
    action: 'CREATE',
    description: 'Create prescription',
  },
  {
    name: 'PRESCRIPTION:VIEW',
    resource: 'PRESCRIPTION',
    action: 'VIEW',
    description: 'View prescription',
  },
  {
    name: 'PRESCRIPTION:UPDATE',
    resource: 'PRESCRIPTION',
    action: 'UPDATE',
    description: 'Update prescription',
  },
  {
    name: 'PRESCRIPTION:DELETE',
    resource: 'PRESCRIPTION',
    action: 'DELETE',
    description: 'Delete prescription',
  },
  {
    name: 'PRESCRIPTION:PRINT',
    resource: 'PRESCRIPTION',
    action: 'PRINT',
    description: 'Print prescription',
  },

  // LAB TEST
  {
    name: 'LAB_TEST:CREATE',
    resource: 'LAB_TEST',
    action: 'CREATE',
    description: 'Create lab test',
  },
  { name: 'LAB_TEST:VIEW', resource: 'LAB_TEST', action: 'VIEW', description: 'View lab test' },
  {
    name: 'LAB_TEST:UPDATE',
    resource: 'LAB_TEST',
    action: 'UPDATE',
    description: 'Update lab test',
  },
  {
    name: 'LAB_TEST:DELETE',
    resource: 'LAB_TEST',
    action: 'DELETE',
    description: 'Delete lab test',
  },
  {
    name: 'LAB_TEST:APPROVE',
    resource: 'LAB_TEST',
    action: 'APPROVE',
    description: 'Approve lab result',
  },
  {
    name: 'LAB_TEST:PRINT',
    resource: 'LAB_TEST',
    action: 'PRINT',
    description: 'Print lab report',
  },

  // PHARMACY
  {
    name: 'PHARMACY_MEDICINE:CREATE',
    resource: 'PHARMACY_MEDICINE',
    action: 'CREATE',
    description: 'Create medicine',
  },
  {
    name: 'PHARMACY_MEDICINE:VIEW',
    resource: 'PHARMACY_MEDICINE',
    action: 'VIEW',
    description: 'View medicine',
  },
  {
    name: 'PHARMACY_MEDICINE:UPDATE',
    resource: 'PHARMACY_MEDICINE',
    action: 'UPDATE',
    description: 'Update medicine',
  },
  {
    name: 'PHARMACY_MEDICINE:DELETE',
    resource: 'PHARMACY_MEDICINE',
    action: 'DELETE',
    description: 'Delete medicine',
  },
  {
    name: 'PHARMACY_MEDICINE:STOCK_UPDATE',
    resource: 'PHARMACY_MEDICINE',
    action: 'STOCK_UPDATE',
    description: 'Update stock',
  },

  // BILLING
  { name: 'BILLING:CREATE', resource: 'BILLING', action: 'CREATE', description: 'Create bill' },
  { name: 'BILLING:VIEW', resource: 'BILLING', action: 'VIEW', description: 'View bill' },
  { name: 'BILLING:UPDATE', resource: 'BILLING', action: 'UPDATE', description: 'Update bill' },
  { name: 'BILLING:DELETE', resource: 'BILLING', action: 'DELETE', description: 'Delete bill' },
  { name: 'BILLING:PAY', resource: 'BILLING', action: 'PAY', description: 'Process payment' },
  {
    name: 'BILLING:REFUND',
    resource: 'BILLING',
    action: 'REFUND',
    description: 'Refund payment',
  },
  { name: 'BILLING:PRINT', resource: 'BILLING', action: 'PRINT', description: 'Print bill' },

  // ADMISSION
  {
    name: 'ADMISSION:CREATE',
    resource: 'ADMISSION',
    action: 'CREATE',
    description: 'Admit patient',
  },
  {
    name: 'ADMISSION:VIEW',
    resource: 'ADMISSION',
    action: 'VIEW',
    description: 'View admission',
  },
  {
    name: 'ADMISSION:UPDATE',
    resource: 'ADMISSION',
    action: 'UPDATE',
    description: 'Update admission',
  },
  {
    name: 'ADMISSION:DISCHARGE',
    resource: 'ADMISSION',
    action: 'DISCHARGE',
    description: 'Discharge patient',
  },
  {
    name: 'ADMISSION:DELETE',
    resource: 'ADMISSION',
    action: 'DELETE',
    description: 'Delete admission',
  },

  // DOCTOR
  { name: 'DOCTOR:CREATE', resource: 'DOCTOR', action: 'CREATE', description: 'Create doctor' },
  { name: 'DOCTOR:VIEW', resource: 'DOCTOR', action: 'VIEW', description: 'View doctor' },
  { name: 'DOCTOR:UPDATE', resource: 'DOCTOR', action: 'UPDATE', description: 'Update doctor' },
  { name: 'DOCTOR:DELETE', resource: 'DOCTOR', action: 'DELETE', description: 'Delete doctor' },
  {
    name: 'DOCTOR:SCHEDULE_MANAGE',
    resource: 'DOCTOR',
    action: 'SCHEDULE_MANAGE',
    description: 'Manage doctor schedule',
  },

  // USER
  { name: 'USER:CREATE', resource: 'USER', action: 'CREATE', description: 'Create user' },
  { name: 'USER:VIEW', resource: 'USER', action: 'VIEW', description: 'View user' },
  { name: 'USER:UPDATE', resource: 'USER', action: 'UPDATE', description: 'Update user' },
  { name: 'USER:DELETE', resource: 'USER', action: 'DELETE', description: 'Delete user' },
  {
    name: 'USER:RESET_PASSWORD',
    resource: 'USER',
    action: 'RESET_PASSWORD',
    description: 'Reset user password',
  },
  { name: 'USER:BLOCK', resource: 'USER', action: 'BLOCK', description: 'Block user' },

  // ROLE
  { name: 'ROLE:CREATE', resource: 'ROLE', action: 'CREATE', description: 'Create role' },
  { name: 'ROLE:VIEW', resource: 'ROLE', action: 'VIEW', description: 'View role' },
  { name: 'ROLE:UPDATE', resource: 'ROLE', action: 'UPDATE', description: 'Update role' },
  { name: 'ROLE:DELETE', resource: 'ROLE', action: 'DELETE', description: 'Delete role' },

  // PERMISSION
  {
    name: 'PERMISSION:ASSIGN',
    resource: 'PERMISSION',
    action: 'ASSIGN',
    description: 'Assign permission',
  },
  {
    name: 'PERMISSION:REMOVE',
    resource: 'PERMISSION',
    action: 'REMOVE',
    description: 'Remove permission',
  },
  {
    name: 'PERMISSION:VIEW',
    resource: 'PERMISSION',
    action: 'VIEW',
    description: 'View permission',
  },

  // REPORT
  { name: 'REPORT:VIEW', resource: 'REPORT', action: 'VIEW', description: 'View reports' },
  { name: 'REPORT:EXPORT', resource: 'REPORT', action: 'EXPORT', description: 'Export reports' },
  {
    name: 'REPORT:FINANCIAL',
    resource: 'REPORT',
    action: 'FINANCIAL',
    description: 'Financial reports',
  },
  {
    name: 'REPORT:PATIENT',
    resource: 'REPORT',
    action: 'PATIENT',
    description: 'Patient reports',
  },
  {
    name: 'REPORT:APPOINTMENT',
    resource: 'REPORT',
    action: 'APPOINTMENT',
    description: 'Appointment reports',
  },

  // SETTINGS
  { name: 'SETTINGS:VIEW', resource: 'SETTINGS', action: 'VIEW', description: 'View settings' },
  {
    name: 'SETTINGS:UPDATE',
    resource: 'SETTINGS',
    action: 'UPDATE',
    description: 'Update settings',
  },
  {
    name: 'SETTINGS:HOSPITAL_PROFILE',
    resource: 'SETTINGS',
    action: 'HOSPITAL_PROFILE',
    description: 'Manage hospital profile',
  },
  {
    name: 'SETTINGS:BILLING_CONFIG',
    resource: 'SETTINGS',
    action: 'BILLING_CONFIG',
    description: 'Manage billing config',
  },
  {
    name: 'SETTINGS:EMAIL_CONFIG',
    resource: 'SETTINGS',
    action: 'EMAIL_CONFIG',
    description: 'Manage email config',
  },
  {
    name: 'SETTINGS:SMS_CONFIG',
    resource: 'SETTINGS',
    action: 'SMS_CONFIG',
    description: 'Manage SMS config',
  },

  // FILE
  { name: 'FILE:UPLOAD', resource: 'FILE', action: 'UPLOAD', description: 'Upload file' },
  { name: 'FILE:VIEW', resource: 'FILE', action: 'VIEW', description: 'View file' },
  { name: 'FILE:DELETE', resource: 'FILE', action: 'DELETE', description: 'Delete file' },
  { name: 'FILE:DOWNLOAD', resource: 'FILE', action: 'DOWNLOAD', description: 'Download file' },

  // NOTIFICATION
  {
    name: 'NOTIFICATION:SEND',
    resource: 'NOTIFICATION',
    action: 'SEND',
    description: 'Send notification',
  },
  {
    name: 'NOTIFICATION:VIEW',
    resource: 'NOTIFICATION',
    action: 'VIEW',
    description: 'View notification',
  },
  {
    name: 'NOTIFICATION:DELETE',
    resource: 'NOTIFICATION',
    action: 'DELETE',
    description: 'Delete notification',
  },
] as const;

export type TAuthPermission = (typeof authPermissions)[number]['name'];

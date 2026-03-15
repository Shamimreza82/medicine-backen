export const roles = [
  { name: 'Super Admin', slug: 'SUPER_ADMIN', level: 100, isSystem: true },
  { name: 'Support Admin', slug: 'SUPPORT_ADMIN', level: 95, isSystem: true },
  { name: 'System Auditor', slug: 'SYSTEM_AUDITOR', level: 90, isSystem: true },

  { name: 'Tenant Admin', slug: 'TENANT_ADMIN', level: 80, isSystem: true },
  { name: 'Tenant Manager', slug: 'TENANT_MANAGER', level: 75, isSystem: true },
  { name: 'Department Admin', slug: 'DEPARTMENT_ADMIN', level: 70, isSystem: true },

  { name: 'Doctor', slug: 'DOCTOR', level: 60, isSystem: true },
  { name: 'Senior Doctor', slug: 'SENIOR_DOCTOR', level: 58, isSystem: true },
  { name: 'Junior Doctor', slug: 'JUNIOR_DOCTOR', level: 55, isSystem: true },

  { name: 'Head Nurse', slug: 'HEAD_NURSE', level: 50, isSystem: true },
  { name: 'Nurse', slug: 'NURSE', level: 48, isSystem: true },

  { name: 'Lab Technician', slug: 'LAB_TECHNICIAN', level: 45, isSystem: true },
  { name: 'Pharmacist', slug: 'PHARMACIST', level: 45, isSystem: true },

  { name: 'Accountant', slug: 'ACCOUNTANT', level: 40, isSystem: true },
  { name: 'Receptionist', slug: 'RECEPTIONIST', level: 35, isSystem: true },

  { name: 'IT Admin', slug: 'IT_ADMIN', level: 30, isSystem: true },
  { name: 'Data Analyst', slug: 'DATA_ANALYST', level: 25, isSystem: true },

  { name: 'Patient', slug: 'PATIENT', level: 10, isSystem: true },
  { name: 'Patient Guardian', slug: 'PATIENT_GUARDIAN', level: 5, isSystem: true },
] as const;

export type TRoles = (typeof roles)[number]['slug'];

export const tenantTypes = [
  {
    code: 'HOSPITAL',
    name: 'Hospital',
    description: 'Full scale hospital with multiple departments',
  },
  {
    code: 'CLINIC',
    name: 'Clinic',
    description: 'Small clinic with limited services',
  },
  {
    code: 'DIAGNOSTIC_CENTER',
    name: 'Diagnostic Center',
    description: 'Lab and diagnostic testing center',
  },
  {
    code: 'PHARMACY',
    name: 'Pharmacy',
    description: 'Medicine and prescription pharmacy',
  },
] as const;

export type TTenantTypes = (typeof tenantTypes)[number]['code'];

  export const hospitalFeatures = [
    { code: 'PATIENT_MANAGEMENT', name: 'Patient Management' },
    { code: 'APPOINTMENT_SYSTEM', name: 'Appointment System' },
    { code: 'PRESCRIPTION_SYSTEM', name: 'Prescription System' },
    { code: 'BILLING_SYSTEM', name: 'Billing System' },
    { code: 'INVENTORY_SYSTEM', name: 'Inventory System' },
    { code: 'LAB_MODULE', name: 'Lab Module' },
  ] as const;

  export type THospitalFeatures = typeof hospitalFeatures[number]['code']
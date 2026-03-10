import { StatusCodes } from 'http-status-codes';
import { prisma } from '@/bootstrap/prisma';
import { AppError } from '@/shared/errors/AppError';

export async function seedRoles() {
  const roles = [
    { name: 'Super Admin', slug: 'SUPER_ADMIN', isSystem: true },
    { name: 'Support Admin', slug: 'SUPPORT_ADMIN', isSystem: true },
    { name: 'System Auditor', slug: 'SYSTEM_AUDITOR', isSystem: true },

    { name: 'Hospital Admin', slug: 'HOSPITAL_ADMIN', isSystem: true },
    { name: 'Hospital Manager', slug: 'HOSPITAL_MANAGER', isSystem: true },
    { name: 'Department Admin', slug: 'DEPARTMENT_ADMIN', isSystem: true },
    { name: 'HR Manager', slug: 'HR_MANAGER', isSystem: true },

    { name: 'Doctor', slug: 'DOCTOR', isSystem: true },
    { name: 'Senior Doctor', slug: 'SENIOR_DOCTOR', isSystem: true },
    { name: 'Junior Doctor', slug: 'JUNIOR_DOCTOR', isSystem: true },
    { name: 'Consultant', slug: 'CONSULTANT', isSystem: true },
    { name: 'Surgeon', slug: 'SURGEON', isSystem: true },
    { name: 'Resident Doctor', slug: 'RESIDENT_DOCTOR', isSystem: true },
    { name: 'Intern Doctor', slug: 'INTERN_DOCTOR', isSystem: true },

    { name: 'Head Nurse', slug: 'HEAD_NURSE', isSystem: true },
    { name: 'Nurse', slug: 'NURSE', isSystem: true },
    { name: 'Assistant Nurse', slug: 'ASSISTANT_NURSE', isSystem: true },

    { name: 'Lab Manager', slug: 'LAB_MANAGER', isSystem: true },
    { name: 'Lab Technician', slug: 'LAB_TECHNICIAN', isSystem: true },
    { name: 'Lab Assistant', slug: 'LAB_ASSISTANT', isSystem: true },
    { name: 'Pathologist', slug: 'PATHOLOGIST', isSystem: true },

    { name: 'Pharmacy Manager', slug: 'PHARMACY_MANAGER', isSystem: true },
    { name: 'Pharmacist', slug: 'PHARMACIST', isSystem: true },
    { name: 'Pharmacy Assistant', slug: 'PHARMACY_ASSISTANT', isSystem: true },

    { name: 'Account Manager', slug: 'ACCOUNT_MANAGER', isSystem: true },
    { name: 'Accountant', slug: 'ACCOUNTANT', isSystem: true },
    { name: 'Billing Officer', slug: 'BILLING_OFFICER', isSystem: true },
    { name: 'Insurance Officer', slug: 'INSURANCE_OFFICER', isSystem: true },
    { name: 'Cashier', slug: 'CASHIER', isSystem: true },

    { name: 'Receptionist', slug: 'RECEPTIONIST', isSystem: true },
    { name: 'Front Desk Manager', slug: 'FRONT_DESK_MANAGER', isSystem: true },
    { name: 'Appointment Coordinator', slug: 'APPOINTMENT_COORDINATOR', isSystem: true },
    { name: 'Patient Relation Officer', slug: 'PATIENT_RELATION_OFFICER', isSystem: true },

    { name: 'Medical Record Officer', slug: 'MEDICAL_RECORD_OFFICER', isSystem: true },
    { name: 'Document Manager', slug: 'DOCUMENT_MANAGER', isSystem: true },

    { name: 'Inventory Manager', slug: 'INVENTORY_MANAGER', isSystem: true },
    { name: 'Store Keeper', slug: 'STORE_KEEPER', isSystem: true },

    { name: 'IT Admin', slug: 'IT_ADMIN', isSystem: true },
    { name: 'System Operator', slug: 'SYSTEM_OPERATOR', isSystem: true },
    { name: 'Technical Support', slug: 'TECH_SUPPORT', isSystem: true },

    { name: 'Data Analyst', slug: 'DATA_ANALYST', isSystem: true },
    { name: 'Report Manager', slug: 'REPORT_MANAGER', isSystem: true },

    { name: 'Patient', slug: 'PATIENT', isSystem: true },
    { name: 'Patient Guardian', slug: 'PATIENT_GUARDIAN', isSystem: true },
  ];

  const hospital = await prisma.hospital.findFirst({
    where: { email: 'demo@hospital.com' },
  });

  if (!hospital) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Hospital not found');
  }

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        hospitalId_slug: {
          slug: role.slug,
          hospitalId: hospital.id,
        },
      },
      update: {},
      create: {
        ...role,
        hospitalId: hospital.id,
      },
    });
  }

  console.log(`✅ Seeded ${roles.length} roles`);
}

import { prisma } from './src/bootstrap/prisma';

async function seedActivities() {
  const activities = [
    { action: 'Updated Brand', target: 'Napa 500mg Tablet', userName: 'Admin', details: 'Updated price and pack size' },
    { action: 'Added New Generic', target: 'Azithromycin v2', userName: 'Admin', details: 'Added clinical indications' },
    { action: 'Modified Indication', target: 'Hypertension', userName: 'Admin', details: 'Linked 5 new generics' },
    { action: 'Deleted Company', target: 'Old Pharma Ltd', userName: 'Admin', details: 'Cleaned up inactive records' },
    { action: 'Imported Data', target: 'Lab Tests CSV', userName: 'System', details: 'Imported 850 records' },
  ];

  for (const activity of activities) {
    await prisma.auditLog.create({
      data: activity,
    });
  }

  console.log('Seeded 5 activities.');
}

seedActivities()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

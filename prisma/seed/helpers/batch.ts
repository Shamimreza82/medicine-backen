import { PrismaClient } from '@prisma/client';

/**
 * High-performance batch insertion using createMany.
 * Splits data into chunks to prevent memory overflows and database timeouts.
 */
export const batchInsert = async (
  prisma: any,
  model: string,
  data: any[],
  chunkSize = 5000
) => {
  if (!data.length) return;

  console.log(`Feeding ${data.length} records into ${model}...`);
  
  let count = 0;
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const result = await prisma[model].createMany({
      data: chunk,
      skipDuplicates: true,
    });
    count += result.count;
    console.log(`  Progress: ${Math.min(i + chunkSize, data.length)} / ${data.length}`);
  }
  
  console.log(`Successfully added ${count} new records to ${model}.`);
};

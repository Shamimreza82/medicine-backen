import { Prisma } from '@prisma/client';

import { prisma } from '@/bootstrap/prisma';
import { AppError } from '@/shared/errors/AppError';
import { paginateResponse } from '@/shared/utils/paginateResponse';

import { LabTestRepository } from './labTest.repository';

import type { LabTestSearchQuery } from './labTest.types';

export const LabTestService = {
  async searchLabTests(query: LabTestSearchQuery) {
    const { data, total } = await LabTestRepository.search(query);

    return paginateResponse(data, total, Number(query.page), Number(query.limit));
  },

  async getLabTestById(id: string) {
    const labTest = await LabTestRepository.findById(id);
    if (!labTest) {
      throw new AppError(404, 'Lab test not found');
    }
    return labTest;
  },

  async createLabTest(data: Prisma.LabTestCreateInput) {
    // Generate slug from name if not provided
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    return LabTestRepository.create(data);
  },

  async updateLabTest(id: string, data: Prisma.LabTestUpdateInput) {
    await this.getLabTestById(id);
    return LabTestRepository.update(id, data);
  },

  async deleteLabTest(id: string) {
    await this.getLabTestById(id);
    return LabTestRepository.delete(id);
  },

  async bulkUploadLabTests(fileBuffer: Buffer) {
    const csv = require('csv-parse/sync');
    const records = csv.parse(fileBuffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    let successCount = 0;
    let skippedCount = 0;

    for (const record of records) {
      const { name, slug, shortName, category, description, specimen, preparation, normalRange, unit, isActive, metadata } = record;
      
      if (!name) {
        skippedCount++;
        continue;
      }

      // Check if already exists
      const existing = await LabTestRepository.search({ q: `"${name}"` }); 
      // Note: LabTestRepository.search uses name: { contains: q }, but we want exact match for skip
      // Better to add a findByName to repository or use Prisma directly
      
      const exactMatch = await prisma.labTest.findUnique({ where: { name } });

      if (exactMatch) {
        skippedCount++;
        continue;
      }

      // Generate slug if not provided
      const generatedSlug = slug || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

      let parsedMetadata = null;
      if (metadata && metadata.trim()) {
        try {
          parsedMetadata = JSON.parse(metadata);
        } catch (e) {
          console.warn(`Invalid metadata JSON for ${name}:`, metadata);
        }
      }

      try {
        await LabTestRepository.create({
          name,
          slug: generatedSlug,
          shortName: shortName || null,
          category: category || null,
          description: description || null,
          specimen: specimen || null,
          preparation: preparation || null,
          normalRange: normalRange || null,
          unit: unit || null,
          isActive: isActive === 'True' || isActive === 'true' || isActive === true,
          metadata: parsedMetadata,
        });
        successCount++;
      } catch (error) {
        console.error(`Failed to create lab test ${name}:`, error);
        skippedCount++;
      }
    }

    return { successCount, skippedCount };
  },

  async getExportData() {
    return LabTestRepository.search({ limit: 10000 }); // Fetch up to 10k records for export
  },
};




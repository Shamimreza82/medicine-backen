import { Prisma } from '@prisma/client';

import { prisma } from '@/bootstrap/prisma';
import { AppError } from '@/shared/errors/AppError';
import { paginateResponse } from '@/shared/utils/paginateResponse';
import { adminRepository } from '../admin/admin.repository';

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
    const result = await LabTestRepository.create(data);
    await adminRepository.createAuditLog({
      action: 'Added New Lab Test',
      target: result.name,
      userName: 'Admin',
    });
    return result;
  },

  async updateLabTest(id: string, data: Prisma.LabTestUpdateInput) {
    await this.getLabTestById(id);
    const result = await LabTestRepository.update(id, data);
    await adminRepository.createAuditLog({
      action: 'Updated Lab Test',
      target: result.name,
      userName: 'Admin',
    });
    return result;
  },

  async deleteLabTest(id: string) {
    const existing = await this.getLabTestById(id);
    const result = await LabTestRepository.delete(id);
    await adminRepository.createAuditLog({
      action: 'Deleted Lab Test',
      target: existing.name,
      userName: 'Admin',
    });
    return result;
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

    await adminRepository.createAuditLog({
      action: 'Bulk Uploaded Lab Tests',
      target: `${successCount} tests`,
      userName: 'Admin',
      details: `Success: ${successCount}, Skipped: ${skippedCount}`,
    });

    return { successCount, skippedCount };
  },

  async getExportData() {
    return LabTestRepository.search({ limit: 10000 }); // Fetch up to 10k records for export
  },
};

import { LabTestRepository } from './labTest.repository';

import type { LabTestSearchQuery } from './labTest.types';

export const LabTestService = {
  async searchLabTests(query: LabTestSearchQuery) {
    const q = query.q ?? '';
    const limit = query.limit ?? 10;
    const page = query.page ?? 1;
    const [total, labTests] = await LabTestRepository.search(
      q,
      query.category,
      query.specimen,
      limit,
      page,
    );

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
      data: labTests,
    };
  },
};

import { paginateResponse } from '@/shared/utils/paginateResponse';

import { LabTestRepository } from './labTest.repository';

import type { LabTestSearchQuery } from './labTest.types';

export const LabTestService = {
  async searchLabTests(query: LabTestSearchQuery) {
    const { data, total } = await LabTestRepository.search(query);

    return paginateResponse(data, total, Number(query.page), Number(query.limit));
  },
};

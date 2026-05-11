import { TPaginatedResponse, TPaginationMeta } from '@/types/pagination.types';

export const paginateResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): TPaginatedResponse<T> => {
  const safeLimit = Math.max(1, limit);
  const meta: TPaginationMeta = {
    page,
    limit: safeLimit,
    total,
    totalPages: Math.ceil(total / safeLimit),
  };

  return {
    data,
    meta,
  };
};

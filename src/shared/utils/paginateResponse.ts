import { TPaginatedResponse, TPaginationMeta } from '@/types/pagination.types';

export const paginateResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): TPaginatedResponse<T> => {
  const meta: TPaginationMeta = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };

  return {
    meta,
    data,
  };
};

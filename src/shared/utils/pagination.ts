import { TPaginationOptions } from '@/types/pagination.types';

export const calculatePagination = (options: TPaginationOptions) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;

  // Prevent large queries
  const safeLimit = Math.min(limit, 100);

  const skip = (page - 1) * safeLimit;

  return {
    page,
    limit: safeLimit,
    skip,
  };
};

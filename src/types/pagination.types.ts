/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TPaginationOptions {
  page?: number | string;
  limit?: number | string;
}

export type TFilter = Record<string, string | number | boolean | undefined>;

export interface TQueryOptions extends TPaginationOptions {
  // sorting
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';

  // search
  search?: string;

  // filtering
  filters?: Record<string, any>;

  // select specific fields
  fields?: string[];

  // include relations
  include?: string[];

  // date filtering
  dateFrom?: string;
  dateTo?: string;

  // status filtering
  status?: string;

  // boolean filters
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface TPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TPaginatedResponse<T> {
  meta: TPaginationMeta;
  data: T[];
}

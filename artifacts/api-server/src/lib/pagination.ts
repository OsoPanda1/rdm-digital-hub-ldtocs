import type { Request } from "express";

export interface PaginationParams {
  page: number;
  pageSize: number;
  offset: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  ok: true;
  data: T[];
  pagination: PaginationMeta;
}

export function parsePagination(req: Request, defaultPageSize = 12): PaginationParams {
  const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(String(req.query.pageSize ?? String(defaultPageSize)), 10) || defaultPageSize));
  return { page, pageSize, offset: (page - 1) * pageSize };
}

export function paginatedResponse<T>(
  data: T[],
  totalItems: number,
  pagination: PaginationParams,
): PaginatedResponse<T> {
  return {
    ok: true,
    data,
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pagination.pageSize) || 1,
    },
  };
}

/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// ────────────────────────────────────────────────────────────────────
//  Standardized API Response Helpers
//  All routes MUST use these helpers to guarantee a consistent shape:
//
//  Success:  { ok: true,  data: T, ...meta }
//  Error:    { ok: false, error: { code: string, message: string } }
//  Paginated:{ ok: true,  data: T[], pagination: { total, page, limit, pages } }
// ────────────────────────────────────────────────────────────────────

export interface ApiSuccessResponse<T> {
  ok: true;
  data: T;
  [key: string]: unknown;
}

export interface ApiErrorResponse {
  ok: false;
  error: {
    code: string;
    message: string;
  };
}

export interface ApiPaginatedResponse<T> {
  ok: true;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: string | number;
    pages: number;
  };
}

export function apiSuccess<T>(data: T, meta?: Record<string, unknown>): ApiSuccessResponse<T> {
  return { ok: true, data, ...meta };
}

export function apiError(
  code: string,
  message: string,
  status?: number,
): ApiErrorResponse {
  return { ok: false, error: { code, message } };
}

export function apiPaginated<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): ApiPaginatedResponse<T> {
  return {
    ok: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
}

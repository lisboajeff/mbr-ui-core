export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export interface PageRequest {
  page: number;
  size: number;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  total_items: number;
  total_pages: number;
}

export function calculateTotalPages(totalItems: number, size: number): number {
  if (totalItems <= 0 || size <= 0) return 0;
  return Math.ceil(totalItems / size);
}

export function normalizePage(page: number, totalPages: number): number {
  if (totalPages <= 0) return 1;
  return Math.min(Math.max(1, Math.trunc(page)), totalPages);
}

export function getPageRange(
  page: number,
  size: number,
  totalItems: number,
): { start: number; end: number } {
  if (totalItems <= 0 || size <= 0) {
    return { start: 0, end: 0 };
  }
  const safePage = Math.max(1, Math.trunc(page));
  const start = (safePage - 1) * size + 1;
  const end = Math.min(safePage * size, totalItems);
  return { start: Math.min(start, totalItems), end };
}

export function paginateSlice<T>(
  items: readonly T[],
  page: number,
  size: number,
): PageResponse<T> {
  const safeSize = size > 0 ? Math.trunc(size) : DEFAULT_PAGE_SIZE;
  const totalItems = items.length;
  const totalPages = calculateTotalPages(totalItems, safeSize);
  const safePage = normalizePage(page, totalPages);
  const offset = (safePage - 1) * safeSize;

  return {
    items: items.slice(offset, offset + safeSize),
    page: safePage,
    size: safeSize,
    total_items: totalItems,
    total_pages: totalPages,
  };
}

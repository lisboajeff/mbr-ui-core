import { useCallback, useState } from "react";
import { DEFAULT_PAGE_SIZE } from "./pagination.js";

export interface PaginationControls {
  page: number;
  size: number;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  resetPage: () => void;
}

export function usePagination(initialSize: number = DEFAULT_PAGE_SIZE): PaginationControls {
  const [page, setPageState] = useState(1);
  const [size, setSizeState] = useState(initialSize);

  const setPage = useCallback((nextPage: number) => {
    setPageState(Math.max(1, Math.trunc(nextPage)));
  }, []);

  const setSize = useCallback((nextSize: number) => {
    setSizeState(nextSize > 0 ? Math.trunc(nextSize) : DEFAULT_PAGE_SIZE);
    setPageState(1);
  }, []);

  const resetPage = useCallback(() => {
    setPageState(1);
  }, []);

  return { page, size, setPage, setSize, resetPage };
}

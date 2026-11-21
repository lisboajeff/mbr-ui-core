import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/format.js";
import { PAGE_SIZE_OPTIONS, getPageRange } from "../lib/pagination.js";
import { Button, Select } from "./Primitives.js";

export interface PaginationProps {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSizeChange?: (size: number) => void;
  pageSizeOptions?: readonly number[];
  itemLabel?: string;
  className?: string;
}

export function Pagination({
  page,
  size,
  totalItems,
  totalPages,
  onPageChange,
  onSizeChange,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  itemLabel = "registro(s)",
  className,
}: PaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotalPages);
  const { start, end } = getPageRange(safePage, size, totalItems);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/70 px-4 py-3 text-xs text-slate-600",
        className,
      )}
    >
      <div>
        {totalItems === 0 ? (
          <span>Nenhum registro encontrado</span>
        ) : (
          <span>
            Exibindo <strong className="font-semibold text-slate-800">{start}</strong>–
            <strong className="font-semibold text-slate-800">{end}</strong> de{" "}
            <strong className="font-semibold text-slate-800">{totalItems}</strong> {itemLabel}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {onSizeChange ? (
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Por página:</span>
            <Select
              aria-label="Itens por página"
              className="w-20 py-1"
              value={String(size)}
              onChange={(e) => onSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={String(opt)}>
                  {opt}
                </option>
              ))}
            </Select>
          </div>
        ) : null}

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="secondary"
            disabled={safePage <= 1 || totalItems === 0}
            onClick={() => onPageChange(safePage - 1)}
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Anterior
          </Button>
          <span className="px-2 font-mono text-xs text-slate-700">
            {totalItems === 0 ? "0 / 0" : `${safePage} / ${safeTotalPages}`}
          </span>
          <Button
            type="button"
            variant="secondary"
            disabled={safePage >= safeTotalPages || totalItems === 0}
            onClick={() => onPageChange(safePage + 1)}
            aria-label="Próxima página"
          >
            Próxima
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

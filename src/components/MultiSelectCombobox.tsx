import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "../lib/format.js";

export interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
  keywords?: string;
}

export interface MultiSelectComboboxProps {
  options: readonly MultiSelectOption[];
  selectedValues: readonly string[];
  onChange: (nextValues: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  maxVisibleChips?: number;
  className?: string;
}

export function MultiSelectCombobox({
  options,
  selectedValues,
  onChange,
  placeholder = "Selecionar itens...",
  searchPlaceholder = "Buscar por nome, domínio ou subdomínio...",
  emptyMessage = "Nenhum item encontrado.",
  maxVisibleChips = 4,
  className,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      searchInputRef.current?.focus();
    }
  }, [open]);

  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);

  const optionByValue = useMemo(() => {
    const map = new Map<string, MultiSelectOption>();
    for (const opt of options) {
      map.set(opt.value, opt);
    }
    return map;
  }, [options]);

  const filteredOptions = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return options;
    return options.filter((opt) => {
      const haystack = `${opt.label} ${opt.description ?? ""} ${opt.keywords ?? ""}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [options, query]);

  const toggleValue = (value: string) => {
    if (selectedSet.has(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const selectAllVisible = () => {
    const next = new Set(selectedValues);
    for (const opt of filteredOptions) {
      next.add(opt.value);
    }
    onChange(Array.from(next));
  };

  const clearSelection = () => {
    onChange([]);
  };

  const visibleChips = selectedValues.slice(0, maxVisibleChips);
  const hiddenCount = Math.max(0, selectedValues.length - visibleChips.length);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        tabIndex={0}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((prev) => !prev);
          }
        }}
        className={cn(
          "flex min-h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-md border bg-white px-2.5 py-1.5 text-xs transition-colors",
          open
            ? "border-blue-600 ring-2 ring-blue-600/20"
            : "border-slate-300 hover:border-slate-400",
        )}
      >
        <div className="flex flex-1 flex-wrap items-center gap-1.5">
          {selectedValues.length === 0 ? (
            <span className="text-slate-400">{placeholder}</span>
          ) : (
            <>
              {visibleChips.map((val) => {
                const opt = optionByValue.get(val);
                return (
                  <span
                    key={val}
                    className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-medium text-blue-900 border border-blue-200"
                  >
                    <span className="max-w-56 truncate">{opt?.label ?? val}</span>
                    <button
                      type="button"
                      aria-label={`Remover ${opt?.label ?? val}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleValue(val);
                      }}
                      className="rounded p-0.5 text-blue-700 hover:bg-blue-200/70 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
              {hiddenCount > 0 ? (
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                  +{hiddenCount} mais
                </span>
              ) : null}
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {selectedValues.length > 0 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              title="Limpar seleção"
              className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-slate-400 transition-transform",
              open && "rotate-180",
            )}
          />
        </div>
      </div>

      {open ? (
        <div className="absolute z-30 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-100 p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-md border border-slate-300 bg-white py-1.5 pl-8 pr-7 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Limpar busca"
                  className="absolute right-2 top-1.5 rounded p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>
                {selectedValues.length} selecionado(s) · {filteredOptions.length} visível(is)
              </span>
              <div className="flex items-center gap-2">
                {filteredOptions.length > 0 ? (
                  <button
                    type="button"
                    onClick={selectAllVisible}
                    className="font-medium text-blue-700 hover:underline cursor-pointer"
                  >
                    Selecionar visíveis
                  </button>
                ) : null}
                {selectedValues.length > 0 ? (
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="font-medium text-slate-600 hover:underline cursor-pointer"
                  >
                    Limpar
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <ul role="listbox" aria-multiselectable="true" className="max-h-56 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-4 text-center text-xs text-slate-500">{emptyMessage}</li>
            ) : (
              filteredOptions.map((opt) => {
                const checked = selectedSet.has(opt.value);
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={checked}
                      onClick={() => toggleValue(opt.value)}
                      className={cn(
                        "flex w-full items-start gap-2.5 rounded px-2.5 py-2 text-left text-xs transition-colors cursor-pointer",
                        checked
                          ? "bg-blue-50 text-blue-950"
                          : "text-slate-700 hover:bg-slate-50",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                          checked
                            ? "border-blue-700 bg-blue-700 text-white"
                            : "border-slate-300 bg-white",
                        )}
                      >
                        {checked ? <Check className="h-3 w-3" /> : null}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-mono font-semibold truncate">{opt.label}</div>
                        {opt.description ? (
                          <div className="truncate text-[11px] text-slate-500">
                            {opt.description}
                          </div>
                        ) : null}
                      </div>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

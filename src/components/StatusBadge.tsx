import { cn } from "../lib/format.js";

export type BadgeTone = "success" | "warning" | "danger" | "neutral" | "info";

const TONE_MAP: Record<string, BadgeTone> = {
  ATIVO: "success",
  ATIVA: "success",
  ELEGIVEL: "success",
  PUBLISHED: "success",
  PUBLICADO: "success",
  SUCCEEDED: "success",
  CONCLUIDO: "success",
  RUNNING: "info",
  PENDENTE: "warning",
  SUSPENSO: "warning",
  SUSPENSA: "warning",
  PAUSADO: "warning",
  DRAFT: "neutral",
  INATIVO: "neutral",
  INATIVA: "neutral",
  REVOGADO: "danger",
  ARQUIVADO: "danger",
  ARQUIVADA: "danger",
  FAILED: "danger",
  ERRO: "danger",
  INELEGIVEL: "danger",
};

const STYLE_BY_TONE: Record<BadgeTone, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
};

export function StatusBadge({
  status,
  tone,
  className,
}: {
  status: string;
  tone?: BadgeTone;
  className?: string;
}) {
  const resolved = tone ?? TONE_MAP[status.toUpperCase()] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-mono font-medium uppercase tracking-wide",
        STYLE_BY_TONE[resolved],
        className,
      )}
    >
      {status}
    </span>
  );
}

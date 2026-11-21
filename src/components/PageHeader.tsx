import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-900 tracking-tight">{title}</h1>
        <p className="mt-0.5 text-xs text-slate-600">{description}</p>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

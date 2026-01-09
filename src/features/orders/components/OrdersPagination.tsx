import * as React from "react";
import OrderCard from "./OrderCard";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getPages(current: number, total: number) {
  // compact pagination: 1 … (current-1 current current+1) … total
  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);
  pages.add(current);
  pages.add(current - 1);
  pages.add(current + 1);

  const arr = Array.from(pages)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  // insert "gaps" as 0
  const withGaps: Array<number> = [];
  for (let i = 0; i < arr.length; i++) {
    const p = arr[i]!;
    const prev = arr[i - 1];
    if (prev != null && p - prev > 1) withGaps.push(0);
    withGaps.push(p);
  }
  return withGaps;
}

export function OrdersPagination({ page, totalPages, onPageChange }: Props) {
  const p = clamp(page, 1, Math.max(1, totalPages));
  const pages = getPages(p, Math.max(1, totalPages));

  const Btn = ({
    children,
    active,
    disabled,
    onClick,
  }: {
    children: React.ReactNode;
    active?: boolean;
    disabled?: boolean;
    onClick?: () => void;
  }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "h-9 min-w-9 px-3 rounded-xl border text-sm font-medium",
        "focus:outline-none focus:ring-4 focus:ring-slate-100",
        disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-slate-50",
        active
          ? "border-slate-300 bg-slate-900 text-white hover:bg-slate-900"
          : "border-slate-200 bg-white text-slate-800",
      ].join(" ")}
    >
      {children}
    </button>
  );

  return (
    <OrderCard className="p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-slate-600">
          Page <span className="font-medium text-slate-900">{p}</span> of{" "}
          <span className="font-medium text-slate-900">
            {Math.max(1, totalPages)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-end">
          <Btn disabled={p <= 1} onClick={() => onPageChange(p - 1)}>
            ← Prev
          </Btn>

          {pages.map((x, idx) =>
            x === 0 ? (
              <span key={`gap-${idx}`} className="px-2 text-slate-400">
                …
              </span>
            ) : (
              <Btn key={x} active={x === p} onClick={() => onPageChange(x)}>
                {x}
              </Btn>
            )
          )}

          <Btn
            disabled={p >= Math.max(1, totalPages)}
            onClick={() => onPageChange(p + 1)}
          >
            Next →
          </Btn>
        </div>
      </div>
    </OrderCard>
  );
}

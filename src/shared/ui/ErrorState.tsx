import * as React from "react";
import { Link } from "react-router-dom";

type Props = {
  title?: string;
  description?: string;
  // Optional technical details (collapsed)
  details?: string;
  // Retry handler (for queries)
  onRetry?: () => void;

  // Optional link back
  backTo?: { to: string; label: string };
};

const card =
  "rounded-2xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur";

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn’t load the data. Please try again.",
  details,
  onRetry,
  backTo,
}: Props) {
  return (
    <div className={[card, "p-6"].join(" ")} role="alert" aria-live="polite">
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-2xl border border-rose-200 bg-rose-50 p-3">
          <div className="h-6 w-6 rounded-full bg-rose-200" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-lg font-semibold text-slate-900">{title}</div>
          <div className="mt-1 text-sm text-slate-600">{description}</div>

          {(onRetry || backTo) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className={[
                    "h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800",
                    "hover:bg-slate-50 active:translate-y-[0.5px]",
                    "focus:outline-none focus:ring-4 focus:ring-slate-100",
                  ].join(" ")}
                >
                  Try again
                </button>
              )}

              {backTo && (
                <Link
                  to={backTo.to}
                  className={[
                    "h-10 inline-flex items-center rounded-xl border border-slate-200 bg-white px-4",
                    "text-sm font-medium text-slate-800 hover:bg-slate-50",
                    "focus:outline-none focus:ring-4 focus:ring-slate-100",
                  ].join(" ")}
                >
                  {backTo.label}
                </Link>
              )}
            </div>
          )}

          {details ? (
            <details className="mt-4">
              <summary className="cursor-pointer text-xs font-medium text-slate-600 hover:text-slate-800">
                Details
              </summary>
              <pre className="mt-2 max-h-48 overflow-auto rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
                {details}
              </pre>
            </details>
          ) : null}
        </div>
      </div>
    </div>
  );
}

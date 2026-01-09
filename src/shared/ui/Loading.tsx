type LoadingProps = {
  // Screen-reader label
  label?: string;
  // affects spinner & spacing
  size?: "sm" | "md" | "lg";
  // Show subtle skeleton lines under spinner
  variant?: "spinner" | "skeleton" | "combo";
  // centers inside its container
  centered?: boolean;
  // covers the screen with a blur overlay
  overlay?: boolean;
  className?: string;
};

const sizeStyles = {
  sm: { wrap: "gap-2 p-3", spinner: "h-4 w-4", text: "text-xs" },
  md: { wrap: "gap-3 p-4", spinner: "h-5 w-5", text: "text-sm" },
  lg: { wrap: "gap-4 p-6", spinner: "h-6 w-6", text: "text-base" },
} as const;

export function Loading({
  label = "Loading",
  size = "md",
  variant = "combo",
  centered = true,
  overlay = false,
  className = "",
}: LoadingProps) {
  const s = sizeStyles[size];

  const content = (
    <div
      role="status"
      aria-label={label}
      className={[
        "rounded-2xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur",
        "text-slate-700",
        centered ? "mx-auto" : "",
        s.wrap,
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        {/* Spinner */}
        {(variant === "spinner" || variant === "combo") && (
          <span
            className={[
              "inline-block animate-spin rounded-full border-2 border-slate-200 border-t-slate-700",
              s.spinner,
            ].join(" ")}
          />
        )}

        <div className="min-w-0">
          <div className={["font-medium", s.text].join(" ")}>{label}</div>
          <div className="mt-0.5 text-xs text-slate-500">
            Please wait a moment…
          </div>
        </div>
      </div>

      {/* Skeleton */}
      {(variant === "skeleton" || variant === "combo") && (
        <div className="mt-4 space-y-2">
          <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200/70" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200/60" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200/50" />
        </div>
      )}

      <span className="sr-only">{label}</span>
    </div>
  );

  if (!overlay) {
    return (
      <div className={centered ? "grid place-items-center py-8" : ""}>
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/20 p-4">
      {content}
    </div>
  );
}

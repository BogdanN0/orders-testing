import * as React from "react";

type UseLoadingOptions = {
  // Prevent flash for very fast requests
  delayMs?: number;
  // Keep loader visible briefly to avoid flicker
  minDurationMs?: number;
};

// Returns a "stable" boolean for rendering loaders.
// Example: stable = useLoading(isFetching, { delayMs: 150, minDurationMs: 300 })

export function useLoading(isBusy: boolean, opts: UseLoadingOptions = {}) {
  const { delayMs = 120, minDurationMs = 250 } = opts;

  const [visible, setVisible] = React.useState(false);
  const startAtRef = React.useRef<number | null>(null);
  const delayTimerRef = React.useRef<number | null>(null);
  const endTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    // cleanup helpers
    const clearTimers = () => {
      if (delayTimerRef.current) window.clearTimeout(delayTimerRef.current);
      if (endTimerRef.current) window.clearTimeout(endTimerRef.current);
      delayTimerRef.current = null;
      endTimerRef.current = null;
    };

    if (isBusy) {
      clearTimers();
      startAtRef.current = performance.now();

      delayTimerRef.current = window.setTimeout(() => {
        setVisible(true);
      }, delayMs);
      return () => clearTimers();
    }

    // not busy anymore
    clearTimers();

    const startAt = startAtRef.current;
    startAtRef.current = null;

    if (!visible) return;

    const elapsed = startAt ? performance.now() - startAt : minDurationMs;
    const remaining = Math.max(0, minDurationMs - elapsed);

    endTimerRef.current = window.setTimeout(() => {
      setVisible(false);
    }, remaining);

    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBusy]);

  return visible;
}

export function useIsFetchingLoading(isFetching: boolean) {
  return useLoading(isFetching, { delayMs: 120, minDurationMs: 250 });
}

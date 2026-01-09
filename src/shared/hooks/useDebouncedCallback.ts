import * as React from "react";

export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delayMs: number
) {
  const cbRef = React.useRef(callback);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  const cancel = React.useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const debounced = React.useCallback(
    (...args: Parameters<T>) => {
      cancel();
      timerRef.current = window.setTimeout(() => {
        cbRef.current(...args);
      }, delayMs);
    },
    [cancel, delayMs]
  );

  // Auto-cancel on unmount
  React.useEffect(() => cancel, [cancel]);

  return { debounced, cancel };
}

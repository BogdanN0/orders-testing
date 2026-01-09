export type ParamValue = string | number | boolean | null | undefined;

// Reads a number from query params
export function readNumber(
  sp: URLSearchParams,
  key: string
): number | undefined {
  const raw = sp.get(key);
  if (raw == null || raw.trim() === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

// Reads a string from query params
export function readString(
  sp: URLSearchParams,
  key: string
): string | undefined {
  const raw = sp.get(key);
  if (raw == null) return undefined;
  const s = raw.trim();
  return s === "" ? undefined : s;
}

// Reads an enum-like value from query params (string union, enums, etc).
export function readEnum<T extends string>(
  sp: URLSearchParams,
  key: string
): T | undefined {
  const raw = sp.get(key);
  if (raw == null || raw.trim() === "") return undefined;
  return raw as T;
}

// Sets a query param if value is meaningful
export function setParam(sp: URLSearchParams, key: string, value: ParamValue) {
  if (value === undefined || value === null) return;
  if (typeof value === "number" && !Number.isFinite(value)) return;
  const str = String(value);
  if (str.trim() === "") return;
  sp.set(key, str);
}

// Writes an object into URLSearchParams (skipping empty values).
export function writeParamsObject<T extends Record<string, ParamValue>>(
  params: T
): URLSearchParams {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    setParam(sp, key, value);
  }
  return sp;
}

// Generic helper: map URLSearchParams -> typed object using a schema-like mapper.
export function readParamsObject<T>(
  sp: URLSearchParams,
  mapper: (sp: URLSearchParams) => T
): T {
  return mapper(sp);
}

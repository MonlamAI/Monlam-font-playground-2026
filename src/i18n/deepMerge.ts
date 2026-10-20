export function deepMerge<T extends Record<string, unknown>>(base: T, over: Partial<T>): T {
  const out = { ...base } as T;
  for (const key of Object.keys(over) as (keyof T)[]) {
    const o = over[key];
    const b = base[key];
    if (o !== undefined && o !== null && typeof o === 'object' && !Array.isArray(o) && typeof b === 'object' && b !== null) {
      out[key] = deepMerge(b as Record<string, unknown>, o as Record<string, unknown>) as T[keyof T];
    } else if (o !== undefined) {
      out[key] = o as T[keyof T];
    }
  }
  return out;
}

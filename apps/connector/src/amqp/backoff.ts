export interface BackoffOptions {
  baseMs: number;
  capMs: number;
  jitterMs: number;
}

/**
 * Retraso de reconexión/reintento con backoff exponencial, tope y jitter.
 *
 *   delay = min(baseMs * 2^attempt, capMs) + random(0, jitterMs)
 *
 * La función es pura (sin estado) para poder probarla aislada.
 */
export function computeBackoffDelay(attempt: number, options: BackoffOptions): number {
  const exponential = options.baseMs * 2 ** attempt;
  const capped = Math.min(exponential, options.capMs);
  const jitter = Math.random() * options.jitterMs;
  return capped + jitter;
}

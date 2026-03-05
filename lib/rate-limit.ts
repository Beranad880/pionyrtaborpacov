/** Jednoduchý in-memory rate limiter. V multi-instance prostředí použijte Redis. */

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minut

export function checkRateLimit(key: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count++;
  return { allowed: true };
}

export function resetRateLimit(key: string): void {
  store.delete(key);
}

/**
 * In-memory rate limiter. Na Vercel serverless nefunguje across instances —
 * každá funkce má vlastní paměť. Pro produkci s vyšší zátěží přejděte na
 * Upstash Redis: npm i @upstash/ratelimit @upstash/redis
 * (https://vercel.com/guides/rate-limiting-edge-middleware-vercel-kv)
 */

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

const LOGIN_MAX = 5;
const FORM_MAX = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minut

export function checkRateLimit(key: string, max = LOGIN_MAX): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= max) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count++;
  return { allowed: true };
}

export function resetRateLimit(key: string): void {
  store.delete(key);
}

export { FORM_MAX };

import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

export const LOGIN_MAX = 5;
export const FORM_MAX = 10;

// In-memory fallback (dev / missing env vars)
interface Entry { count: number; resetAt: number; }
const store = new Map<string, Entry>();
const WINDOW_MS = 15 * 60 * 1000;

let loginLimiter: Ratelimit | null = null;
let formLimiter: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  loginLimiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(LOGIN_MAX, '15 m'), prefix: 'rl:login' });
  formLimiter  = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(FORM_MAX,  '15 m'), prefix: 'rl:form' });
}

export async function checkRateLimit(key: string, max = LOGIN_MAX): Promise<{ allowed: boolean; retryAfter?: number }> {
  const limiter = max === FORM_MAX ? formLimiter : loginLimiter;

  if (limiter) {
    try {
      const { success, reset } = await limiter.limit(key);
      return { allowed: success, retryAfter: success ? undefined : Math.ceil((reset - Date.now()) / 1000) };
    } catch {
      // Redis nedostupný — projde (fail open)
      return { allowed: true };
    }
  }

  // In-memory fallback
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

export async function resetRateLimit(key: string): Promise<void> {
  store.delete(key);
  if (loginLimiter) {
    try { await (loginLimiter as any).redis?.del(`rl:login:${key}`); } catch {}
  }
}

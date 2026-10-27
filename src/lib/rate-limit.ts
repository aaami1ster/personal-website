// Fixed-window rate limiter kept in process memory (design spec §10.2).
//
// The counts live in this server instance only: they reset on restart, and
// each serverless instance or replica keeps its own Map, so the effective limit
// across a deployment can be higher than `limit`. That is acceptable for a
// low-traffic contact form; a shared store (e.g. Redis) would be needed for a
// global limit.

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

// Expired windows are removed lazily, at most once per minute, so the Map
// never grows with keys that are no longer limited.
const PRUNE_INTERVAL_MS = 60_000;
// Hard cap so a flood of distinct keys cannot exhaust memory. When reached,
// the oldest windows (Map iteration follows insertion order) are dropped.
const MAX_KEYS = 10_000;
let nextPruneAt = 0;

function prune(now: number) {
  if (now >= nextPruneAt) {
    nextPruneAt = now + PRUNE_INTERVAL_MS;
    for (const [key, window] of windows) {
      if (window.resetAt <= now) windows.delete(key);
    }
  }
  if (windows.size >= MAX_KEYS) {
    for (const key of windows.keys()) {
      windows.delete(key);
      if (windows.size < MAX_KEYS) break;
    }
  }
}

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number };

/** Counts one hit for `key`; fails once more than `limit` hits fall in the current window. */
export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  prune(now);

  const current = windows.get(key);
  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  current.count += 1;
  if (current.count > limit) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }
  return { ok: true };
}

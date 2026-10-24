export interface RateLimiter {
  /** Records a hit for `key`; returns how long to wait (ms) if over the limit, else 0. */
  hit(key: string): number;
}

/**
 * Basic fixed-window limiter kept in memory. On Vercel each warm function instance has its own
 * memory, so this is per instance: enough to slow down a single abusive client (brief §7 asks
 * for a basic per-IP limit); a shared store (e.g. Redis) would be the upgrade.
 */
export function createRateLimiter(options: {
  limit: number;
  windowMs: number;
  now?: () => number;
  maxKeys?: number;
}): RateLimiter {
  const { limit, windowMs, now = Date.now, maxKeys = 10_000 } = options;
  const windows = new Map<string, { count: number; resetAt: number }>();

  return {
    hit(key) {
      const time = now();
      if (windows.size >= maxKeys) {
        for (const [k, w] of windows) if (w.resetAt <= time) windows.delete(k);
        if (windows.size >= maxKeys) windows.clear();
      }
      const current = windows.get(key);
      if (!current || current.resetAt <= time) {
        windows.set(key, { count: 1, resetAt: time + windowMs });
        return 0;
      }
      current.count += 1;
      return current.count > limit ? current.resetAt - time : 0;
    },
  };
}

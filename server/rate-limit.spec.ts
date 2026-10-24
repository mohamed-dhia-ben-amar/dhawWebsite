import { describe, expect, it } from 'vitest';
import { createRateLimiter } from './rate-limit';

describe('createRateLimiter', () => {
  it('allows `limit` hits per window, then reports the wait', () => {
    let time = 0;
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000, now: () => time });
    expect(limiter.hit('a')).toBe(0);
    expect(limiter.hit('a')).toBe(0);
    time = 400;
    expect(limiter.hit('a')).toBe(600);
  });

  it('counts each key separately and resets after the window', () => {
    let time = 0;
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => time });
    limiter.hit('a');
    expect(limiter.hit('a')).toBeGreaterThan(0);
    expect(limiter.hit('b')).toBe(0);
    time = 1000;
    expect(limiter.hit('a')).toBe(0);
  });

  it('stays bounded in memory', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, maxKeys: 3, now: () => 0 });
    for (const key of ['a', 'b', 'c', 'd']) limiter.hit(key);
    expect(limiter.hit('a')).toBe(0); // table was cleared when full
  });
});

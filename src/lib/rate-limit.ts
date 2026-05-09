const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 8;

export type RateLimitResult = { ok: true } | { ok: false; retryAfter: number };

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    return {
      ok: false,
      retryAfter: Math.ceil((WINDOW_MS - (now - recent[0])) / 1000),
    };
  }
  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 1024) sweep(now);
  return { ok: true };
}

function sweep(now: number): void {
  for (const [ip, ts] of hits) {
    const live = ts.filter((t) => now - t < WINDOW_MS);
    if (live.length === 0) hits.delete(ip);
    else hits.set(ip, live);
  }
}

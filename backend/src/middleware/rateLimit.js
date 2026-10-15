/**
 * Tiny in-memory, per-IP rate limiter (sufficient for a single instance).
 * @param {{ windowMs: number, max: number }} opts
 */
export function rateLimit({ windowMs, max }) {
  const hits = new Map();

  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of hits) if (entry.reset <= now) hits.delete(ip);
  }, windowMs).unref();

  return (req, res, next) => {
    const now = Date.now();
    const ip = req.ip || 'unknown';
    const entry = hits.get(ip);

    if (!entry || entry.reset <= now) {
      hits.set(ip, { count: 1, reset: now + windowMs });
      return next();
    }
    if (entry.count >= max) {
      res.setHeader('Retry-After', Math.ceil((entry.reset - now) / 1000));
      return res
        .status(429)
        .json({ ok: false, error: 'Çok fazla deneme yaptınız. Lütfen birkaç dakika sonra tekrar deneyin.' });
    }
    entry.count += 1;
    return next();
  };
}

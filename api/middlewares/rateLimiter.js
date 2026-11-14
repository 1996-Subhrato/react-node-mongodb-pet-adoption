const { sendError } = require('../utils/response');

/**
 * In-memory sliding window rate limiter
 */
function createRateLimiter({ windowMs = 60 * 1000, max = 30, message = 'Too many requests, please try again later.' }) {
    const hits = new Map();

    // Periodic cleanup of expired entries
    const cleanupInterval = Math.max(windowMs, 30000);
    setInterval(() => {
        const now = Date.now();
        for (const [key, record] of hits.entries()) {
            if (now > record.resetTime) {
                hits.delete(key);
            }
        }
    }, cleanupInterval).unref();

    return function rateLimiter(req, res, next) {
        // Exclude in test/dev if requested, but active by default
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
        const key = `${req.baseUrl || ''}${req.path}_${ip}`;
        const now = Date.now();

        let record = hits.get(key);
        if (!record || now > record.resetTime) {
            record = { count: 1, resetTime: now + windowMs };
            hits.set(key, record);
        } else {
            record.count += 1;
        }

        res.setHeader('X-RateLimit-Limit', max);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
        res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

        if (record.count > max) {
            return sendError(res, 429, message);
        }

        next();
    };
}

const authLimiter = createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 15, // 15 attempts per minute
    message: 'Too many authentication attempts. Please try again after 1 minute.'
});

const otpLimiter = createRateLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // 5 attempts per 5 mins
    message: 'Too many OTP requests. Please wait 5 minutes before trying again.'
});

const contactLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: 'Too many messages submitted. Please try again later.'
});

module.exports = {
    authLimiter,
    otpLimiter,
    contactLimiter,
    createRateLimiter
};


const cache = require('../utils/cache');

/**
 * Redis caching middleware for GET requests
 * @param {number} ttl Time to live in seconds (default 60)
 */
const cacheMiddleware = (ttl = 60) => {
    return async (req, res, next) => {
        // Only GET requests should be cached
        if (req.method !== 'GET') return next();

        // Generate a unique cache key based on URL and user_id parameter
        const userId = req.query.user_id || 'guest';
        const key = `api_cache:${req.originalUrl}:u${userId}`;

        try {
            const cachedBody = await cache.get(key);
            if (cachedBody) {
                // If found in Redis, return it directly
                // Using res.send because Cache.get already did JSON.parse/stringify if needed,
                // but actually Cache.get returns a JavaScript object.
                // Re-sending it via original res.json is fine.
                return res.status(200).json({
                    ...cachedBody,
                    _cached: true,
                    _cached_at: new Date().toISOString()
                });
            }

            // If not found, hijack the res.json function to save the response to Redis before sending it
            const originalJson = res.json;
            res.json = function (body) {
                // Only cache successful JSON responses
                if (res.statusCode >= 200 && res.statusCode < 300 && body && body.success !== false) {
                    // Store the result in Redis for future requests
                    cache.set(key, body, ttl);
                }
                return originalJson.call(this, body);
            };

            next();
        } catch (error) {
            console.error('Cache Middleware Error:', error.message);
            next();
        }
    };
};

module.exports = cacheMiddleware;

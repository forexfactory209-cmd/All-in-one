const Redis = require('ioredis');

// Connect to Redis (assuming standard localhost:6379, modify as needed)
const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  // Add password if necessary
  password: process.env.REDIS_PASSWORD || undefined
});

redis.on('connect', () => {
    console.log('✅ Connected to Redis cache.');
});

redis.on('error', (err) => {
    console.error('❌ Redis cache error:', err.message);
});

/**
 * Cache Wrapper Function
 * @param {string} key - Cache Key
 * @param {number} ttlInSeconds - Time to live in seconds
 * @param {Function} fetchCallback - Async function to fetch data if cache miss
 */
async function getOrSetCache(key, ttlInSeconds, fetchCallback) {
    try {
        const cachedData = await redis.get(key);
        if (cachedData) {
            return JSON.parse(cachedData);
        }
    } catch (err) {
        console.error(`Redis Get Error for key ${key}:`, err.message);
    }

    // Cache Miss, fetch from DB
    const freshData = await fetchCallback();

    if (freshData !== null && freshData !== undefined) {
        try {
            await redis.set(key, JSON.stringify(freshData), 'EX', ttlInSeconds);
        } catch (err) {
            console.error(`Redis Set Error for key ${key}:`, err.message);
        }
    }

    return freshData;
}

/**
 * Invalidate specifically cached entries
 * @param {string} pattern - Prefix/key pattern
 */
async function invalidateCache(pattern) {
    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(keys);
        }
    } catch (err) {
        console.error(`Redis Invalidate Error for pattern ${pattern}:`, err.message);
    }
}

function getIsUsable() {
    return redis.status === 'ready' || redis.status === 'connect';
}

module.exports = {
    redis,
    getOrSetCache,
    invalidateCache,
    getIsUsable
};

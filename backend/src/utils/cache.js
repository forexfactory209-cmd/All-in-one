const { redis, getIsUsable } = require('../config/redis');

/**
 * Cache utility for Redis
 */
class Cache {
    /**
     * Get data from cache
     * @param {string} key 
     */
    async get(key) {
        if (!getIsUsable()) return null;
        try {
            const data = await redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Redis Get Error [${key}]:`, error.message);
            return null;
        }
    }

    /**
     * Set data to cache with TTL
     * @param {string} key 
     * @param {any} value 
     * @param {number} ttl In seconds, default 300s (5 mins)
     */
    async set(key, value, ttl = 300) {
        if (!getIsUsable()) return false;
        try {
            await redis.set(key, JSON.stringify(value), 'EX', ttl);
            return true;
        } catch (error) {
            console.error(`Redis Set Error [${key}]:`, error.message);
            return false;
        }
    }

    /**
     * Delete data from cache
     * @param {string} key 
     */
    async del(key) {
        if (!getIsUsable()) return false;
        try {
            await redis.del(key);
            return true;
        } catch (error) {
            console.error(`Redis Del Error [${key}]:`, error.message);
            return false;
        }
    }

    /**
     * Delete multiple keys by pattern
     * @param {string} pattern 
     */
    async delByPattern(pattern) {
        if (!getIsUsable()) return false;
        try {
            const keys = await redis.keys(pattern);
            if (keys.length > 0) {
                await redis.del(...keys);
            }
            return true;
        } catch (error) {
            console.error(`Redis DelPattern Error [${pattern}]:`, error.message);
            return false;
        }
    }
}

module.exports = new Cache();

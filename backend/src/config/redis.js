const Redis = require('ioredis');
require('dotenv').config();

const redisConfig = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || null,
    retryStrategy: (times) => {
        if (times > 3) {
            // Stop retrying after 3 attempts to avoid log spam
            return null;
        }
        return Math.min(times * 200, 1000);
    },
    maxRetriesPerRequest: 1,
};

const redis = new Redis(redisConfig);

redis.on('connect', () => {
    console.log('✅ Redis connected successfully.');
});

redis.on('error', (err) => {
    // Only log the first few errors
    if (redis.status === 'reconnecting' || redis.status === 'connecting') {
        if (!redis._errorLogged) {
            console.warn('⚠️ Redis connection failed. Caching will be disabled.');
            redis._errorLogged = true;
        }
    }
});

module.exports = redis;

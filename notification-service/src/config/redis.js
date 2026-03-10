const Redis = require('ioredis');

const redisConfig = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null, // Required by BullMQ
};

const connection = new Redis(redisConfig);

connection.on('connect', () => {
    console.log('✅ Notification Service connected to Redis');
});

connection.on('error', (err) => {
    console.error('❌ Redis connection error:', err.message);
});

module.exports = connection;

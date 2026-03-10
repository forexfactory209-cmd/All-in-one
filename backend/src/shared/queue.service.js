const { Queue } = require('bullmq');
require('dotenv').config();

const redisConfig = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined
};

// Create queues
const bookingQueue = new Queue('booking-tasks', { connection: redisConfig });
const emailQueue = new Queue('email-tasks', { connection: redisConfig });

/**
 * Add a job to the booking queue
 */
const addBookingJob = async (type, data) => {
    try {
        await bookingQueue.add(type, data, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000
            },
            removeOnComplete: true,
            removeOnFail: false
        });
        console.log(`✅ Background job queued: ${type}`);
    } catch (error) {
        console.error(`❌ Failed to queue background job [${type}]:`, error.message);
    }
};

module.exports = {
    addBookingJob,
    bookingQueue,
    emailQueue
};

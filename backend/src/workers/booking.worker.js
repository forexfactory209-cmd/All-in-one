const { Worker } = require('bullmq');
require('dotenv').config();

const redisConfig = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined
};

/**
 * Worker to process booking and notification tasks
 */
const bookingWorker = new Worker('booking-tasks', async job => {
    const { type, data } = job;
    console.log(`👷 Processing job [${job.id}] of type: ${job.name}`);

    try {
        switch (job.name) {
            case 'SEND_CONFIRMATION':
                console.log(`📧 Sending confirmation to ${data.email || 'user'} for booking ${data.bookingId}...`);
                // Simulate network latency
                await new Promise(resolve => setTimeout(resolve, 2000));
                console.log(`✅ Confirmation sent!`);
                break;

            case 'PROCESS_ANALYTICS':
                console.log(`📊 Updating hotel analytics for hotel ${data.hotelId}...`);
                await new Promise(resolve => setTimeout(resolve, 3000));
                console.log(`✅ Analytics updated!`);
                break;

            case 'NOTIFY_ADMIN':
                console.log(`🔔 Notifying admin about new booking: ${data.bookingId}`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                break;

            default:
                console.warn(`⚠️ Unknown job type: ${job.name}`);
        }
    } catch (error) {
        console.error(`❌ Job ${job.id} failed:`, error.message);
        throw error; // Let BullMQ handle retries
    }
}, { 
    connection: redisConfig,
    concurrency: 5 // Process 5 jobs at a time
});

bookingWorker.on('completed', job => {
    console.log(`✅ Job [${job.id}] completed.`);
});

bookingWorker.on('failed', (job, err) => {
    console.error(`❌ Job [${job.id}] failed: ${err.message}`);
});

console.log('🚀 Booking Task Worker is running...');

module.exports = bookingWorker;

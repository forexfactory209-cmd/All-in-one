const { Worker } = require('bullmq');
const connection = require('../config/redis');
const { sendPushNotification } = require('../services/pushService');
const { sendSMS } = require('../services/smsService');
const { sendEmail } = require('../services/emailService');

// The backend queues them on 'booking-tasks'
const worker = new Worker(
    'booking-tasks',
    async (job) => {
        console.log(`[Worker] Processing job ${job.id} for ${job.name}`);

        const { bookingId, userId, totalPrice, entityType, entityId } = job.data;

        try {
            switch (job.name) {
                case 'SEND_CONFIRMATION':
                    // In a real scenario, you'd fetch the user's tokens/emails from the DB here using userId
                    const deviceToken = "mock_device_token_for_" + userId; // Replace with actual DB fetch

                    const title = "Booking Confirmed";
                    const body = `Your booking #${bookingId} has been confirmed. Total paid: $${totalPrice}`;

                    // Insert to DB as InApp notification history first
                    const pool = require('../config/database');
                    await pool.execute(`
                        INSERT INTO notifications (user_id, title, message, type, status)
                        VALUES (?, ?, ?, 'InApp', 'Sent')
                    `, [userId || 1, title, body]);

                    // 1. Send Push Notification to Guest
                    await sendPushNotification(deviceToken, { title, body });

                    // 2. Send SMS to Guest
                    await sendSMS("+25263XXXXXXX", `SomStay: Booking #${bookingId} is confirmed. Enjoy your stay!`);

                    break;

                case 'NOTIFY_ADMIN':
                    // 1. Email Admin/Hotel Owner
                    await sendEmail(
                        "admin@somstay.com",
                        "New Booking Received",
                        `<h3>New Booking #${bookingId}</h3><p>Entity Type: ${entityType}</p><p>Entity ID: ${entityId}</p>`
                    );
                    break;

                case 'PROCESS_ANALYTICS':
                    console.log(`[Worker] Processing Analytics for item: ${entityId}`);
                    // Perform analytics logic here
                    break;

                default:
                    console.warn(`[Worker] Unknown job name: ${job.name}`);

            }

            console.log(`[Worker] Job ${job.id} processed successfully`);
        } catch (error) {
            console.error(`[Worker] Failed job ${job.id}:`, error);
            throw error; // Let BullMQ handle retries
        }
    },
    {
        connection,
        concurrency: 5 // Process 5 jobs at a time
    }
);

worker.on('failed', (job, err) => {
    console.error(`❌ [Worker] Job ${job.id} has failed with ${err.message}`);
});

worker.on('completed', (job) => {
    console.log(`✅ [Worker] Job ${job.id} has completed!`);
});

module.exports = worker;

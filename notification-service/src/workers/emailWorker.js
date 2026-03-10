const { Worker } = require('bullmq');
const connection = require('../config/redis');
const { sendEmail } = require('../services/emailService');

const emailWorker = new Worker(
    'email-tasks',
    async (job) => {
        console.log(`[EmailWorker] Processing job ${job.id} for ${job.name}`);

        const { to, subject, body } = job.data;
        await sendEmail(to, subject, body);
    },
    {
        connection,
        concurrency: 2
    }
);

emailWorker.on('failed', (job, err) => {
    console.error(`❌ [EmailWorker] Job ${job.id} has failed with ${err.message}`);
});

emailWorker.on('completed', (job) => {
    console.log(`✅ [EmailWorker] Job ${job.id} has completed!`);
});

module.exports = emailWorker;

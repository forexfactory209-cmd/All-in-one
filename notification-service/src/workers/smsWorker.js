const { Worker } = require('bullmq');
const connection = require('../config/redis');
const { sendSMS } = require('../services/smsService');

// The sms channel is also isolated as 'sms-tasks'
const smsWorker = new Worker(
    'sms-tasks',
    async (job) => {
        console.log(`[SMSWorker] Processing job ${job.id} for ${job.name}`);

        const { to, message } = job.data;
        await sendSMS(to, message);
    },
    {
        connection,
        concurrency: 5
    }
);

smsWorker.on('failed', (job, err) => {
    console.error(`❌ [SMSWorker] Job ${job.id} has failed with ${err.message}`);
});

smsWorker.on('completed', (job) => {
    console.log(`✅ [SMSWorker] Job ${job.id} has completed!`);
});

module.exports = smsWorker;

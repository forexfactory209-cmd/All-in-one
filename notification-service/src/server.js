require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./config/database');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({
        status: 'Notification Service is running',
        uptime: process.uptime()
    });
});

const PORT = 5001;

// Start DB, then workers, then server
async function bootstrap() {
    try {
        await initDatabase();

        // Import workers only AFTER initDatabase completes so the proxy pool is ready
        require('./workers/pushWorker');
        require('./workers/emailWorker');
        require('./workers/smsWorker');

        // Routes
        app.use('/api/v1/notifications', require('./routes/notificationRoutes'));

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🔔 Notification Service is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start notification service:', err);
    }
}

bootstrap();

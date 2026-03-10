require('dotenv').config();
const app = require('./app');
const { initDatabase } = require('./config/database');

const PORT = process.env.NODE_ENV || 5000;

/**
 * Boot sequence:
 *  1. Open SSH tunnel to VPS
 *  2. Connect MySQL pool through the tunnel
 *  3. Start Express server
 */
async function startServer() {
    try {
        // Step 1 & 2: SSH tunnel + MySQL pool
        await initDatabase();

        // Step 2.5: Initialize Elasticsearch (non-blocking)
        const { checkConnection, initIndex } = require('./utils/elasticsearch');
        checkConnection().then(connected => {
            if (connected) initIndex();
        });

        // Step 2.6: Start Background Workers
        require('./workers/booking.worker');

        // Step 3: Start Express
        const server = app.listen(process.env.PORT || 5000, () => {
            console.log(`
🚀 Server is running on port : ${process.env.PORT || 5000}
🌍 Environment               : ${process.env.NODE_ENV}
🛠️  Health Check              : http://localhost:${process.env.PORT || 5000}/api/health
            `);
        });

        // Handle graceful shutdown
        process.on('unhandledRejection', (err) => {
            console.log('UNHANDLED REJECTION! 💥 Shutting down...');
            console.log(err.name, err.message);
            server.close(() => process.exit(1));
        });

        process.on('uncaughtException', (err) => {
            console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
            console.log(err.name, err.message);
            process.exit(1);
        });

    } catch (err) {
        console.error('💥 Failed to start server:', err.message);
        process.exit(1);
    }
}

startServer();

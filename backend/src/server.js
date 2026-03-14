require('dotenv').config();

const PORT = process.env.PORT || 5000;

/**
 * Boot sequence:
 *  1. Open SSH tunnel to VPS
 *  2. Connect MySQL pool through the tunnel
 *  3. Start Express server
 */
async function startServer() {
    try {
        // Step 1: SSH tunnels + MySQL pool
        const { initDatabase } = require('./config/database');
        await initDatabase();

        // Step 2: Connect to Redis (now that tunnel is open)
        const { redis } = require('./config/redis');
        try {
            await redis.connect();
        } catch (err) {
            console.error('⚠️ Redis connection failed, but continuing...', err.message);
        }

        // Step 2.5: Initialize Elasticsearch (non-blocking)
        const { checkConnection, initIndex } = require('./utils/elasticsearch');
        checkConnection().then(connected => {
            if (connected) initIndex();
        });

        // Step 2.6: Start Background Workers
        const { startWorker } = require('./workers/booking.worker');
        startWorker();

        // Step 3: Start Express
        const app = require('./app');
        const server = app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
            console.log(`
🚀 Server is running on port : ${process.env.PORT || 5000}
🌍 Environment               : ${process.env.NODE_ENV}
🛠️  Health Check             : http://192.168.100.17:${process.env.PORT || 5000}/api/health
            `);
        });

        // Handle graceful shutdown
        process.on('unhandledRejection', (err) => {
            console.log('UNHANDLED REJECTION! 💥 Shutting down...');
            console.log(err.name, err.message);
            if (server && server.close) {
                server.close(() => process.exit(1));
            } else {
                process.exit(1);
            }
        });

        process.on('uncaughtException', (err) => {
            console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
            console.log(err.name, err.message);
            if (server && server.close) {
                server.close(() => process.exit(1));
            } else {
                process.exit(1);
            }
        });

    } catch (err) {
        console.error('💥 Failed to start server:', err.message);
        process.exit(1);
    }
}

startServer();

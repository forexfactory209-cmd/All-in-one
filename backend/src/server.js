require('dotenv').config();
const app = require('./app');

/**
 * Start Express Server
 */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`
🚀 Server is running on port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV}
🛠️ Health Check: http://localhost:${PORT}/api/health
    `);
});

/**
 * Handle Unhandled Promise Rejections
 */
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

/**
 * Handle Uncaught Exceptions
 */
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

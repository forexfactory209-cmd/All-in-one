const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { globalErrorHandler, notFoundHandler } = require('./middleware/error.middleware');
const { sendResponse } = require('./utils/response');

const app = express();

// 1. Security HTTP Headers
app.use(helmet());

// 2. CORS
app.use(cors());

// 3. Development Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 4. Rate Limiting
const limiter = rateLimit({
    max: 100, // max 100 requests per windowMs
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many requests from this IP, please try again in 15 minutes!'
});
app.use('/api', limiter);

// 5. Body Parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 6. Health Check Route
app.get('/api/health', (req, res) => {
    return sendResponse(res, 200, true, 'Backend Service is Healthy 🚀', {
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});

// 7. API Routes (To be loaded from modules)
// app.use('/api/v1/auth', require('./modules/auth/authRoutes'));

// 8. 404 Handler
app.all('*', notFoundHandler);

// 9. Global Error Handler
app.use(globalErrorHandler);

module.exports = app;

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { globalErrorHandler, notFoundHandler } = require('./middleware/error.middleware');
const { sendResponse } = require('./utils/response');

const app = express();

// 1. Security HTTP Headers — allow images to be served and loaded cross-origin
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "https:", "http:"],
        },
    },
}));

// 2. CORS
app.use(cors());

// 3. Development Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 4. Rate Limiting
const limiter = rateLimit({
    max: 1000, // Increased for development and admin usage
    windowMs: 15 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in 15 minutes!'
});
app.use('/api', limiter);

// 5. Body Parser - Increased limit to handle property/hotel data with many images
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 6. Serve uploaded images as static files at /uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 7. Health Check Route
app.get('/api/health', (req, res) => {
    return sendResponse(res, 200, true, 'Backend Service is Healthy 🚀', {
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});

// 8. API Routes
app.use('/api/v1/properties', require('./modules/properties/properties.routes'));
app.use('/api/v1/hotels', require('./modules/hotels/hotels.routes'));
app.use('/api/v1/rooms', require('./modules/rooms/rooms.routes'));
app.use('/api/v1/upload', require('./modules/upload/upload.routes'));
app.use('/api/v1/users', require('./modules/users/users.routes'));
app.use('/api/v1/bookings', require('./modules/bookings/bookings.routes'));
app.use('/api/v1/payments', require('./modules/payments/payments.routes'));
app.use('/api/v1/disputes', require('./modules/disputes/disputes.routes'));
app.use('/api/v1/reports', require('./modules/reports/reports.routes'));
app.use('/api/v1/settings', require('./modules/settings/settings.routes'));

// 9. 404 Handler
app.all('*', notFoundHandler);

// 10. Global Error Handler
app.use(globalErrorHandler);

module.exports = app;

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const responseTime = require('response-time');
const logger = require('./utils/logger');
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

// 3. Compression
app.use(compression());

// 4. Development Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 5. Response Time Tracking & Logging
app.use(responseTime((req, res, time) => {
    logger.info(`${req.method} ${req.originalUrl} - ${time.toFixed(2)}ms`);
}));

// 6. Rate Limiting
const limiter = rateLimit({
    max: 1000, // 1000 requests per 1 minute during development
    windowMs: 1 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in a minute!',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

// 5. Body Parser - Increased limit to handle property/hotel data with many images
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 6. Serve uploaded images as static files at /uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 7. Health Check Route
app.get('/api/health', (req, res) => {
    const healthData = {
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        memoryUsage: process.memoryUsage(),
        timestamp: new Date().toISOString()
    };

    return sendResponse(res, 200, true, 'Backend Service is Healthy 🚀', healthData);
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
app.use('/api/v1/wishlist', require('./modules/wishlist/wishlist.routes'));
app.use('/api/v1/cars', require('./modules/cars/cars.routes'));
app.use('/api/v1/car-bookings', require('./modules/car_bookings/car_bookings.routes'));
app.use('/api/v1/tours', require('./modules/tours/tours.routes'));

// 9. 404 Handler
app.all('*', notFoundHandler);

// 10. Global Error Handler
app.use(globalErrorHandler);

module.exports = app;

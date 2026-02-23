const { sendError } = require('../utils/responseHelper');

/**
 * Global centralized error handling middleware
 */
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        console.error('💥 ERROR:', err);
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            stack: err.stack,
            error: err
        });
    }

    // Production build error response
    return sendError(res, err.statusCode, err.message || 'Internal Server Error');
};

/**
 * Handle 404 Route Not Found
 */
const notFoundHandler = (req, res, next) => {
    const error = new Error(`Can't find ${req.originalUrl} on this server!`);
    error.statusCode = 404;
    next(error);
};

module.exports = {
    globalErrorHandler,
    notFoundHandler
};

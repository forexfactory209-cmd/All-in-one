const { sendError } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Global centralized error handling middleware
 */
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    // Log error with Winston
    logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
        stack: err.stack
    });

    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            stack: err.stack,
            error: err
        });
    }

    // Standardized production error response
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

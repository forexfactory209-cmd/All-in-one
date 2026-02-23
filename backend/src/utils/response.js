/**
 * Clean reusable response helper
 */
const sendResponse = (res, statusCode, success, message, data = null) => {
    return res.status(statusCode).json({
        success,
        message,
        data,
        timestamp: new Date().toISOString()
    });
};

const sendError = (res, statusCode, message, errors = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
        timestamp: new Date().toISOString()
    });
};

module.exports = {
    sendResponse,
    sendError
};

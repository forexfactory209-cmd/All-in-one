/**
 * Clean reusable response helper
 */
const sendResponse = (res, statusCode, success, message, data = null, errors = null, pagination = null) => {
    const response = {
        success,
        message,
        data,
        errors,
        timestamp: new Date().toISOString()
    };

    if (pagination) {
        response.pagination = pagination;
    }

    return res.status(statusCode).json(response);
};

const sendError = (res, statusCode, message, errors = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
        data: null,
        timestamp: new Date().toISOString()
    });
};

module.exports = {
    sendResponse,
    sendError
};

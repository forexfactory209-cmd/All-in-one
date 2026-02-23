const { sendError } = require('../utils/response');

/**
 * Role Authorization Middleware
 * @param {...string} roles - Allowed roles
 */
const restrictTo = (...roles) => {
    return (req, res, next) => {
        // req.user is set by auth protector
        if (!roles.includes(req.user.role)) {
            return sendError(res, 403, 'You do not have permission to perform this action.');
        }
        next();
    };
};

module.exports = { restrictTo };

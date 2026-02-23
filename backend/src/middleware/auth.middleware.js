const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/response');

/**
 * JWT Verification Middleware
 */
const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return sendError(res, 401, 'Please log in to get access.');
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return sendError(res, 401, 'Invalid or expired token.');
        }

        // Add user data to request
        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { protect };

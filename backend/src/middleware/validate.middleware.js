const { sendError } = require('../utils/response');

/**
 * Middleware to validate request data using Zod schema
 * @param {import('zod').ZodSchema} schema 
 */
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        const errors = error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
        }));
        return sendError(res, 400, 'Validation failed', errors);
    }
};

module.exports = validate;

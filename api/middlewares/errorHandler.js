const { sendError } = require('../utils/response');

function errorHandler(err, req, res, next) {
    console.error('Unhandled Application Error:', err);

    if (res.headersSent) {
        return next(err);
    }

    // Specific error type handling
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return sendError(res, 401, 'Authentication failed. Invalid or expired token.');
    }

    if (err.name === 'BSONError' || err.name === 'BSONTypeError') {
        return sendError(res, 400, 'Invalid resource identifier format.');
    }

    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';

    return sendError(
        res,
        statusCode,
        statusCode === 500 && process.env.NODE_ENV === 'production'
            ? 'An internal server error occurred.'
            : message,
        err.stack
    );
}

module.exports = errorHandler;


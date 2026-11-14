/**
 * Standardized API Response Helper
 * Conforms to coding standards ({ success, message, data }) while maintaining
 * backward-compatibility with existing frontend checks ({ error, result, feedbacks, pet }).
 */

function sendSuccess(res, statusCode = 200, message = 'Success', data = null, extra = {}) {
    const payload = {
        success: true,
        error: false,
        message,
        data,
        result: data, // Backward compatibility with existing frontend
        ...extra
    };
    return res.status(statusCode).json(payload);
}

function sendError(res, statusCode = 400, message = 'An error occurred', errorDetails = null, errors = null) {
    const payload = {
        success: false,
        error: true,
        message,
        errorDetails: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
        errors
    };
    return res.status(statusCode).json(payload);
}

module.exports = {
    sendSuccess,
    sendError
};


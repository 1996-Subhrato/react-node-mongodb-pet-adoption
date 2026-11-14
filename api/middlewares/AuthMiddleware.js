const { verifyToken } = require('../utils/crypto');
const { sendError } = require('../utils/response');

/**
 * Admin Authorization Middleware
 * Verifies JWT and strictly enforces 'admin' role.
 */
function adminAuthMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return sendError(res, 401, 'Please SignIn First!!');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return sendError(res, 401, 'Invalid authorization format. Expected: Bearer <token>');
    }

    const token = parts[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return sendError(res, 401, 'Invalid or expired session. Please sign in again.');
    }

    if (decoded.role !== 'admin') {
        return sendError(res, 403, 'Forbidden: Admin privileges required.');
    }

    req.adminInfo = decoded;
    req.user = decoded;
    next();
}

/**
 * User Authorization Middleware
 * Verifies JWT and allows 'user' (or 'admin') roles.
 */
function userAuthMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return sendError(res, 401, 'Please SignIn First!!');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return sendError(res, 401, 'Invalid authorization format. Expected: Bearer <token>');
    }

    const token = parts[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return sendError(res, 401, 'Invalid or expired session. Please sign in again.');
    }

    if (decoded.role !== 'user' && decoded.role !== 'admin') {
        return sendError(res, 403, 'Forbidden: User privileges required.');
    }

    req.userInfo = decoded;
    req.user = decoded;
    next();
}

/**
 * Optional Auth Middleware
 * Sets req.user if a valid token is provided, otherwise leaves it undefined.
 */
function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const parts = authHeader.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            const decoded = verifyToken(parts[1]);
            if (decoded) {
                req.user = decoded;
                if (decoded.role === 'admin') req.adminInfo = decoded;
                if (decoded.role === 'user') req.userInfo = decoded;
            }
        }
    }
    next();
}

module.exports = {
    adminAuthMiddleware,
    userAuthMiddleware,
    optionalAuth
};

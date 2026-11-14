const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('./env');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_pet_adoption_secret_key_2026';

/**
 * Hash a password using Node's native scrypt with a random 16-byte salt
 * Output format: scrypt$salt$hash
 */
function hashPassword(password) {
    if (!password || typeof password !== 'string') {
        throw new Error('Password must be a non-empty string');
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

/**
 * Compare password against stored hash (with legacy plain-text fallback for smooth migration)
 */
function comparePassword(plainPassword, storedHash) {
    if (!plainPassword || !storedHash) return { match: false, needsRehash: false };

    // Format: scrypt$salt$hash
    if (storedHash.startsWith('scrypt$')) {
        const parts = storedHash.split('$');
        if (parts.length === 3) {
            const salt = parts[1];
            const originalHash = Buffer.from(parts[2], 'hex');
            const comparisonHash = crypto.scryptSync(plainPassword, salt, 64);
            if (originalHash.length === comparisonHash.length && crypto.timingSafeEqual(originalHash, comparisonHash)) {
                return { match: true, needsRehash: false };
            }
        }
        return { match: false, needsRehash: false };
    }

    // Legacy plain-text fallback (automatically flags for upgrade on successful login)
    if (plainPassword === storedHash) {
        return { match: true, needsRehash: true };
    }

    return { match: false, needsRehash: false };
}

/**
 * Generate a cryptographically secure 6-digit numeric OTP
 */
function generateOTP() {
    return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Sign JWT token with role, ID, email, and expiration
 */
function signToken(payload, expiresIn = '24h') {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify JWT token
 */
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}

/**
 * Generate a short-lived reset token (valid for 15 minutes)
 */
function generateResetToken(email, role) {
    return jwt.sign({ email, role, purpose: 'password_reset' }, JWT_SECRET, { expiresIn: '15m' });
}

/**
 * Verify a reset token
 */
function verifyResetToken(token, expectedRole) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && decoded.purpose === 'password_reset' && (!expectedRole || decoded.role === expectedRole)) {
            return decoded;
        }
        return null;
    } catch {
        return null;
    }
}

module.exports = {
    hashPassword,
    comparePassword,
    generateOTP,
    signToken,
    verifyToken,
    generateResetToken,
    verifyResetToken,
    JWT_SECRET
};


const { ObjectId } = require('mongodb');

/**
 * Validates whether a value is a valid MongoDB ObjectId hex string
 */
function isValidObjectId(id) {
    if (!id || typeof id !== 'string') return false;
    if (id.length !== 24) return false;
    return /^[0-9a-fA-F]{24}$/.test(id) && ObjectId.isValid(id);
}

/**
 * Safely parses a string into an ObjectId, returning null if invalid
 */
function toObjectId(id) {
    if (!isValidObjectId(id)) return null;
    try {
        return new ObjectId(id);
    } catch {
        return null;
    }
}

module.exports = {
    isValidObjectId,
    toObjectId,
    ObjectId
};


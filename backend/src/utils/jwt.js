const jwt = require('jsonwebtoken');

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// We embed the role in the token so a single /me endpoint can resolve
// whether the cookie belongs to a user or a food partner.
function signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { signToken, verifyToken };

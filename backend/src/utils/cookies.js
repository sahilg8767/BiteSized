const isProd = process.env.NODE_ENV === 'production';

// Centralised cookie config so auth cookies are always httpOnly and,
// in production, Secure + SameSite=None (needed for cross-site frontend).
const COOKIE_NAME = 'token';

const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function setAuthCookie(res, token) {
    res.cookie(COOKIE_NAME, token, cookieOptions);
}

function clearAuthCookie(res) {
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: undefined });
}

module.exports = { COOKIE_NAME, setAuthCookie, clearAuthCookie };

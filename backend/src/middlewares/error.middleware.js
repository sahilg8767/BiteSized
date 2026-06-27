// Central error handler. Any error passed to next(err) or thrown inside an
// asyncHandler ends up here and is returned as consistent JSON.
function notFound(req, res) {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars -- Express needs the 4-arg signature
function errorHandler(err, req, res, next) {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';

    // Mongoose duplicate key (e.g. email already used)
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        message = `An account with this ${field} already exists`;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map((e) => e.message).join(', ');
    }

    if (statusCode === 500) {
        console.error('[error]', err);
    }

    res.status(statusCode).json({ message });
}

module.exports = { notFound, errorHandler };

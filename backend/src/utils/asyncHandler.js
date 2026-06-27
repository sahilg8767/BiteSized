// Wraps an async route handler so any thrown/rejected error is forwarded
// to Express' central error handler instead of crashing the process.
function asyncHandler(handler) {
    return (req, res, next) => {
        Promise.resolve(handler(req, res, next)).catch(next);
    };
}

module.exports = asyncHandler;

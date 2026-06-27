// A small typed error so controllers can throw meaningful HTTP errors
// (e.g. throw new ApiError(404, "Food not found")) that the central
// error handler turns into a clean JSON response.
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
    }
}

module.exports = ApiError;

const { validationResult } = require('express-validator');

// Runs after a list of express-validator checks; collects any failures
// into a single 400 response so controllers stay focused on logic.
function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg,
            errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
    }
    next();
}

module.exports = validate;

const ExpressError = require("../utils/ExpressError");

module.exports = (req, res, next) => {
    next(new ExpressError("page not found", 404));
};

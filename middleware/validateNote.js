const ExpressError = require("../utils/ExpressError");
// const { log } = require("../utils/log");

module.exports = (req, res, next) => {
    // log(req.body);
    const { content } = req.body;
    if (!content) throw new ExpressError("note.content is missing", 400);
    next();
};

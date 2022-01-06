const User = require("../models/User");
const ExpressError = require("../utils/ExpressError");
// const { log } = require("../utils/log");

module.exports = async (req, res, next) => {
    // log(req.body);
    const { username } = req.body;
    const doc = await User.find({ username: username }).exec();
    if (doc.length) throw new ExpressError("username to be unique", 400);
    next();
};

const loginRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

loginRouter.post(
    "/",
    catchAsync(async (req, res) => {
        const { body } = req;
        const { username, password } = body;

        const user = await User.findOne({ username });
        const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

        if (!(user && passwordCorrect)) {
            throw new ExpressError("invalid user or password", 401);
        }
        const userForToken = {
            id: user._id,
            username: user.username,
        };
        const expirationTime = process.env.NODE_ENV === "test" ? 60 * 5 : 60 * 60 * 24; // 5 min
        const token = jwt.sign(userForToken, process.env.JWT_SECRET, {
            expiresIn: expirationTime,
        });
        res.send({
            name: user.name,
            username: user.username,
            token,
        });
    })
);

module.exports = loginRouter;

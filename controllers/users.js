const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const validateUsername = require("../middleware/validateUsename");

usersRouter.get(
    "/",
    catchAsync(async (req, res) => {
        const users = await User.find({}).populate("notes", { content: 1, date: 1, important: 1 });
        res.json(users);
    })
);

usersRouter.post(
    "/",
    catchAsync(validateUsername),
    catchAsync(async (req, res) => {
        const { body } = req;
        const { username, name, password } = body;

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const user = new User({
            username,
            name,
            passwordHash,
        });

        const savedUser = await user.save();
        res.status(201).json(savedUser);
        // res.status(201).json({ hola: "hola" });
    })
);

module.exports = usersRouter;

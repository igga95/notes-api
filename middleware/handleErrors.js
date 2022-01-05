const { log, error } = require("../utils/log");

// module.exports = (err, req, res, next) => { //midudev
//     error(err);
//     if (err.name === "CastError")
//         res.status(400).json({ error: "id malform" }).end();
//     res.status(500).json({ error: "internal error" }).end();
//     next();
// };

module.exports = (err, req, res, next) => {
    // colt steele
    log(err);
    if (err.name === "CastError") err = { msg: "id malform", status: 400 };
    if (err._message === "User validation failed") err = { msg: err.errors._id.message, status: 400 };
    // if (err._message === "User validation failed") err = { msg: "`username` to be unique", status: 400 };

    const { status = 500 } = err;
    if (!err.msg) err.msg = "Oh boy! Something went wrong!";

    res.status(status).json({ error: err.msg }).end();
    next();
};

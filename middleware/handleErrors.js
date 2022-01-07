const { log, error } = require("../utils/log");

// module.exports = (err, req, res, next) => { //midudev
//     error(err);
//     if (err.name === "CastError")
//         res.status(400).json({ error: "id malform" }).end();
//     res.status(500).json({ error: "internal error" }).end();
//     next();
// };

const ERROR_HANDLERS = {
    CastError: () => {
        return { msg: "id malform", status: 400 };
    },
    TokenExpiredError: () => {
        return { msg: "token expired", status: 401 };
    },
    defaultError: () => {
        return { msg: "internal error", status: 500 };
    },
};

module.exports = (err, req, res, next) => {
    error(err);
    const handler = ERROR_HANDLERS[err.name] || ERROR_HANDLERS.defaultError;
    if (!err.msg) err = handler();
    res.status(err.status).json({ error: err.msg }).end();
    next();
};

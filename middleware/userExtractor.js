const ExpressError = require("../utils/ExpressError");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authorization = req.get("authorization");
    let token = null;

    if (authorization && authorization.toLowerCase().startsWith("bearer")) {
        token = authorization.split(" ")[1];
    } else throw new ExpressError("token missing or invalid", 401);

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!token || !decodedToken.id) throw new ExpressError("token missing or invalid", 401);

    const { id: userId } = decodedToken;

    req.userId = userId;
    next();
};

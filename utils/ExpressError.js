class ExpressError extends Error {
    // colt steele
    constructor(msg, status) {
        super();
        this.msg = msg;
        this.status = status;
    }
}

module.exports = ExpressError;

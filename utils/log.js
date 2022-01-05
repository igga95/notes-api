// Made especially for AVA testing, that do not have a flag to ignore console.log()
module.exports.log = (msg) => {
    if (!(process.env.NODE_ENV === "test")) return console.log(msg);
};

module.exports.error = (msg) => {
    if (!(process.env.NODE_ENV === "test")) return console.error(msg);
};

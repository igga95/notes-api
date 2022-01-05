const mongoose = require("mongoose");
const { log, error } = require("./utils/log");

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env;

const connectionString = NODE_ENV === "test" ? MONGO_DB_URI_TEST : MONGO_DB_URI;

mongoose
    .connect(connectionString)
    .then(() => {
        log("Database connected");
    })
    .catch((err) => {
        error(err);
    });

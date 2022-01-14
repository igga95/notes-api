require("dotenv").config();
require("./mongo"); // DB Conection

const express = require("express");
const app = express();

const cors = require("cors");

const { log } = require("./utils/log");
const notFound = require("./middleware/notFound");
const handleErrors = require("./middleware/handleErrors");

const notesRouter = require("./controllers/notes");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1>Hello World!</h1>");
});

app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.all("*", notFound);

app.use(handleErrors);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    log(`Server running on port ${PORT}.`);
});

module.exports = { app, server };

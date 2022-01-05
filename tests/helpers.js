const supertest = require("supertest");
const { app } = require("../app");
const api = supertest(app);

const User = require("../models/User");

const initialNotes = [
    {
        content: "Aprendiendo Fullstack JS con midudev",
        important: true,
        date: new Date(),
    },
    {
        content: "prueba 123",
        important: false,
        date: new Date(),
    },
];

const getAllContentFromNote = async () => {
    const res = await api.get("/api/notes");
    return {
        res,
        contents: res.body.map((note) => note.content),
    };
};

const getUsers = async () => {
    const usersDB = await User.find({});
    return usersDB.map((el) => el.toJSON());
};

module.exports = {
    api,
    initialNotes,
    getAllContentFromNote,
    getUsers,
};

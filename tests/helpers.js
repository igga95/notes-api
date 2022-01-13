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

const initialUsers = [
    {
        username: "admin",
        user: "Admin",
        password: "Admin_Password",
    },
    {
        username: "gabriel",
        user: "Gabriel",
        password: "GBL_Password",
    },
];

const getAllContentFromNote = async (token) => {
    const res = await api.get("/api/notes").set("Authorization", "Bearer " + token);
    return {
        res,
        contents: res.body.map((note) => note.content),
    };
};

const getUsers = async () => {
    const usersDB = await User.find({});
    return usersDB.map((el) => el.toJSON());
};

const loginUser = async (user) => {
    const res = await api
        .post("/api/login")
        .send(user)
        .expect(200)
        .expect("Content-Type", /application\/json/);
    // console.log(res);
    return { loginContent: res.body };
};

module.exports = {
    api,
    initialNotes,
    initialUsers,
    getAllContentFromNote,
    getUsers,
    loginUser,
};

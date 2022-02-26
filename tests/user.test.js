const { server } = require("../app");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const User = require("../models/User");
const { api, getUsers } = require("../tests/helpers");

describe("creating a new user", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        const passwordHash = await bcrypt.hash("pswd", 10);
        const user = new User({ username: "admin", passwordHash });
        await user.save();
    });

    test("works as expected creating a fresh username", async () => {
        const usersAtStart = await getUsers();

        const newUser = {
            username: "gabriel",
            name: "Gabriel",
            password: "gabriel123",
        };

        await api
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const usersAtEnd = await getUsers();

        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
        const usernames = usersAtEnd.map((el) => el.username);
        expect(usernames).toContain(newUser.username);
    });

    test("creation fails with proper statuscode and message if username is already taken", async () => {
        const usersAtStart = await getUsers();
        const newUser = {
            username: "admin",
            name: "Gabriel",
            password: "pwdtest",
        };

        const res = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        expect(res.body.error).toContain("username to be unique");

        const usersAtEnd = await getUsers();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
});

afterAll(async () => {
    mongoose.connection.close();
    server.close();
});

const { api, initialNotes, getAllContentFromNote, initialUsers, loginUser } = require("../tests/helpers");
const { server } = require("../app");
const mongoose = require("mongoose");
const Note = require("../models/Note");
const User = require("../models/User");
const bcrypt = require("bcrypt");

let session = null;

beforeAll(async () => {
    await User.deleteMany({});
    const saltRounds = 10;
    for (const user of initialUsers) {
        const passwordHash = await bcrypt.hash(user.password, saltRounds);
        const userObject = new User({
            username: user.username,
            name: user.name,
            passwordHash: passwordHash,
        });
        await userObject.save();
    }
});

beforeEach(async () => {
    const [user] = await User.find({ username: "admin" });
    await Note.deleteMany({});
    for (const note of initialNotes) {
        note.user = user._id;
        const newNote = new Note(note);
        await newNote.save();
    }
});

describe("POST /api/login", () => {
    test("a user can login", async () => {
        const { loginContent } = await loginUser({ username: "admin", password: "Admin_Password" });
        session = loginContent.token;
        expect(loginContent.username).toContain("admin");
    });
});

describe("GET /api/notes", () => {
    test("can not get notes without authorization", async () => {
        await api
            .get("/api/notes")
            .expect(401)
            .expect("Content-Type", /application\/json/);
    });

    test("notes are returned as json", async () => {
        await api
            .get("/api/notes")
            .set("Authorization", "Bearer " + session)
            .expect(200)
            .expect("Content-Type", /application\/json/);
    });

    test("there are two notes", async () => {
        const res = await api.get("/api/notes").set("Authorization", "Bearer " + session);
        expect(res.body).toHaveLength(initialNotes.length);
    });

    test("the first note is about midudev", async () => {
        const { contents } = await getAllContentFromNote(session);
        expect(contents).toContain("Aprendiendo Fullstack JS con midudev");
    });
});

describe("POST /api/notes", () => {
    test("a valid note can be added", async () => {
        const newNote = {
            content: "Proximamente async/await",
            important: true,
        };
        await api
            .post("/api/notes")
            .set("Authorization", "Bearer " + session)
            .send(newNote)
            .expect(201)
            .expect("Content-Type", /application\/json/);
        const { res, contents } = await getAllContentFromNote(session);
        expect(res.body).toHaveLength(initialNotes.length + 1);
        expect(contents).toContain(newNote.content);
    });

    test("note without content is not added", async () => {
        const newNote = {
            important: true,
        };
        await api
            .post("/api/notes")
            .set("Authorization", "Bearer " + session)
            .send(newNote)
            .expect(400);
        const res = await api.get("/api/notes").set("Authorization", "Bearer " + session);
        expect(res.body).toHaveLength(initialNotes.length);
    });
});

describe("PUT /api/notes/:id", () => {
    test("a valid note can be updated", async () => {
        const resPUT = await api.get("/api/notes").set("Authorization", "Bearer " + session);
        const noteToUpdate = resPUT.body[0];
        const newNote = {
            content: "Testing PUT request",
            important: true,
        };
        await api
            .put(`/api/notes/${noteToUpdate.id}`)
            .set("Authorization", "Bearer " + session)
            .send(newNote)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        const { res, contents } = await getAllContentFromNote(session);
        expect(res.body).toHaveLength(initialNotes.length);
        expect(contents).toContain(newNote.content);
        expect(contents).not.toContain(noteToUpdate.content);
    });

    test("note without content can be updated", async () => {
        const resPUT = await api.get("/api/notes").set("Authorization", "Bearer " + session);
        const noteToUpdate = resPUT.body[1];
        const newNote = {
            important: true,
        };
        await api
            .put(`/api/notes/${noteToUpdate.id}`)
            .set("Authorization", "Bearer " + session)
            .send(newNote)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        const { res, contents } = await getAllContentFromNote(session);
        expect(res.body).toHaveLength(initialNotes.length);
        expect(contents).toContain(noteToUpdate.content);
    });
});

describe("DELETE /api/notes/:id", () => {
    test("a note can be deleted", async () => {
        const { res: firstRes } = await getAllContentFromNote(session);
        const { body: notes } = firstRes;
        const noteToDelete = notes[0];
        await api
            .delete(`/api/notes/${noteToDelete.id}`)
            .set("Authorization", "Bearer " + session)
            .expect(204);
        const { res, contents } = await getAllContentFromNote(session);
        expect(res.body).toHaveLength(initialNotes.length - 1);
        expect(contents).not.toContain(noteToDelete.content);
    });

    test("a note that do not exist can not be deleted", async () => {
        await api
            .delete("/api/notes/1234")
            .set("Authorization", "Bearer " + session)
            .expect(400);
        const { res } = await getAllContentFromNote(session);
        expect(res.body).toHaveLength(initialNotes.length);
    });
});

afterAll(async () => {
    mongoose.connection.close();
    server.close();
});

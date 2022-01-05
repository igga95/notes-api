const {
    api,
    initialNotes,
    getAllContentFromNote,
} = require("../tests/helpers");
const { server } = require("../app");
const mongoose = require("mongoose");
const Note = require("../models/Note");

beforeEach(async () => {
    await Note.deleteMany({});
    for (const note of initialNotes) {
        const noteObject = new Note(note);
        await noteObject.save();
    }
});

describe("GET /api/notes", () => {
    test("notes are returned as json", async () => {
        await api
            .get("/api/notes")
            .expect(200)
            .expect("Content-Type", /application\/json/);
    });

    test("there are two notes", async () => {
        const res = await api.get("/api/notes");
        expect(res.body).toHaveLength(initialNotes.length);
    });

    test("the first note is about midudev", async () => {
        const { contents } = await getAllContentFromNote();
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
            .send(newNote)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        const { res, contents } = await getAllContentFromNote();
        expect(res.body).toHaveLength(initialNotes.length + 1);
        expect(contents).toContain(newNote.content);
    });

    test("note without content is not added", async () => {
        const newNote = {
            important: true,
        };
        await api.post("/api/notes").send(newNote).expect(400);
        const res = await api.get("/api/notes");
        expect(res.body).toHaveLength(initialNotes.length);
    });
});

describe("PUT /api/notes/:id", () => {
    test("a valid note can be updated", async () => {
        const resPUT = await api.get("/api/notes");
        const noteToUpdate = resPUT.body[0];
        const newNote = {
            content: "Testing PUT request",
            important: true,
        };
        await api
            .put(`/api/notes/${noteToUpdate.id}`)
            .send(newNote)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        const { res, contents } = await getAllContentFromNote();
        expect(res.body).toHaveLength(initialNotes.length);
        expect(contents).toContain(newNote.content);
        expect(contents).not.toContain(noteToUpdate.content);
    });

    test("note without content can be updated", async () => {
        const resPUT = await api.get("/api/notes");
        const noteToUpdate = resPUT.body[0];
        const newNote = {
            important: true,
        };
        await api
            .put(`/api/notes/${noteToUpdate.id}`)
            .send(newNote)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        const { res, contents } = await getAllContentFromNote();
        expect(res.body).toHaveLength(initialNotes.length);
        expect(contents).toContain(noteToUpdate.content);
    });
});

describe("DELETE /api/notes/:id", () => {
    test("a note can be deleted", async () => {
        const { res: firstRes } = await getAllContentFromNote();
        const { body: notes } = firstRes;
        const noteToDelete = notes[0];
        await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);
        const { res, contents } = await getAllContentFromNote();
        expect(res.body).toHaveLength(initialNotes.length - 1);
        expect(contents).not.toContain(noteToDelete.content);
    });

    test("a note that do not exist can not be deleted", async () => {
        await api.delete("/api/notes/1234").expect(400);
        const { res } = await getAllContentFromNote();
        expect(res.body).toHaveLength(initialNotes.length);
    });
});

afterAll(async () => {
    mongoose.connection.close();
    server.close();
});

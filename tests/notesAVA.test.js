const { api, initialNotes, getAllContentFromNote } = require("./helpers");
const test = require("ava");
const { server } = require("../app");
const mongoose = require("mongoose");
const Note = require("../models/Note");

test.beforeEach(async () => {
    await Note.deleteMany({});
    for (const note of initialNotes) {
        const noteObject = new Note(note);
        await noteObject.save();
    }
});

test("notes are returned as json", async (t) => {
    const res = await api.get("/api/notes");
    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /application\/json/);
});

test("there are two notes", async (t) => {
    const res = await api.get("/api/notes");
    t.is(res.body.length, initialNotes.length);
});

test("the first note is about midudev", async (t) => {
    const { contents } = await getAllContentFromNote();
    t.pass(contents.includes("Aprendiendo Fullstack JS con midudev"));
});

test("a valid note can be added", async (t) => {
    const newNote = {
        content: "Proximamente async/await",
        important: true,
    };
    const resPOST = await api.post("/api/notes").send(newNote);
    t.is(resPOST.statusCode, 200);
    t.regex(resPOST.header["content-type"], /application\/json/);
    const { res, contents } = await getAllContentFromNote();
    t.is(res.body.length, initialNotes.length + 1);
    t.pass(contents.includes(newNote.content));
});

test("note without content is not added", async (t) => {
    const newNote = {
        important: true,
    };
    const resPOST = await api.post("/api/notes").send(newNote);
    t.is(resPOST.statusCode, 400);
    const res = await api.get("/api/notes");
    t.is(res.body.length, initialNotes.length);
});

test("a note can be deleted", async (t) => {
    const { res: firstRes } = await getAllContentFromNote();
    const { body: notes } = firstRes;
    const noteToDelete = notes[0];
    const resDELETE = await api.delete(`/api/notes/${noteToDelete.id}`);
    t.is(resDELETE.statusCode, 204);
    const { res, contents } = await getAllContentFromNote();
    t.is(res.body.length, initialNotes.length - 1);
    t.pass(!contents.includes(noteToDelete.content));
});

test("a note that do not exist can not be deleted", async (t) => {
    const resDELETE = await api.delete("/api/notes/1234");
    t.is(resDELETE.statusCode, 400);
    const { res } = await getAllContentFromNote();
    t.is(res.body.length, initialNotes.length);
});

test.after.always(async () => {
    mongoose.connection.close();
    server.close();
});

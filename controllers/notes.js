const notesRouter = require("express").Router();
const Note = require("../models/Note");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const userExtractor = require("../middleware/userExtractor");
const validateNote = require("../middleware/validateNote");

notesRouter.get(
    "/",
    userExtractor,
    catchAsync(async (req, res) => {
        const { userId } = req;
        const notes = await Note.find({ user: userId }).populate("user", { username: 1, name: 1 });
        // const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
        res.json(notes);
    })
);

notesRouter.get(
    "/:id",
    userExtractor,
    catchAsync(async (req, res) => {
        const { userId } = req;
        console.log(userId);
        const note = await Note.find({ _id: req.params.id, user: userId }).populate("user", { username: 1, name: 1 });
        res.json(note);
    })
);

notesRouter.post(
    "/",
    userExtractor,
    validateNote,
    catchAsync(async (req, res) => {
        const { content, important = false } = req.body;
        const { userId } = req;
        const user = await User.findById(userId);

        const newNote = new Note({
            content: content,
            date: new Date().toISOString(),
            important: important,
            user: user._id,
        });

        const savedNote = await newNote.save();

        user.notes = user.notes.concat(savedNote._id);
        await user.save();

        res.status(201).json(savedNote);
    })
);

notesRouter.put(
    "/:id",
    userExtractor,
    catchAsync(async (req, res) => {
        const { userId } = req;
        const { id } = req.params;
        const note = req.body;

        const noteToUpdate = await Note.find({ _id: id, user: userId }).populate("user", { username: 1, name: 1 });

        if (noteToUpdate.length) {
            const [updatedNote] = noteToUpdate;
            updatedNote.content = note.content;
            updatedNote.important = note.important || updatedNote.important;
            await updatedNote.save();
            res.json(updatedNote);
        }
        res.json(noteToUpdate);
    })
);

notesRouter.delete(
    "/:id",
    userExtractor,
    catchAsync(async (req, res) => {
        const { userId } = req;
        const noteId = req.params.id;
        const { deletedCount } = await Note.deleteOne({ _id: noteId, user: userId });
        if (deletedCount) {
            const user = await User.findById(userId);
            const noteIndex = user.notes.indexOf(noteId);
            user.notes.splice(noteIndex, 1);
            await user.save();
        }
        res.status(204).json({}).end();
    })
);

module.exports = notesRouter;

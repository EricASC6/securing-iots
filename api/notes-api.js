const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Note = require("../models/note").model;

async function authenticateUser(req, res, next) {
  const id = req.params.id;
  const user = await User.findOne({ googleId: id });
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(400).json({ err: "Bad request" });
  }
}

router.use(express.json());

router.get("/notes/all/:id", authenticateUser, (req, res) => {
  const notes = req.user.notes.all;
  res.json({ notes: notes });
});

router.get("/notes/stem/:id", authenticateUser, (req, res) => {
  const stemNotes = req.user.notes.stem;
  res.json({ notes: stemNotes });
});

router.get("/notes/humanities/:id", authenticateUser, (req, res) => {
  const humanitiesNotes = req.user.notes.humanities;
  res.json({ notes: humanitiesNotes });
});

const SUBJECTS = {
  STEM: "stem",
  Humanities: "humanities"
};

router.post("/note/new/:id", authenticateUser, async (req, res) => {
  try {
    const user = req.user;
    const { title, subject, description } = req.body;
    const note = new Note({
      title: title,
      subject: subject,
      description: description
    });

    user.notes.all.unshift(note);
    user.notes[SUBJECTS[subject]].unshift(note);
    await user.save();

    res.json({ note: note });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
});

module.exports = router;

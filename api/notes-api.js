const express = require("express");
const router = express.Router();
const Note = require("../models/note").model;

router.use(express.json());

router.get("/notes/all", (req, res) => {
  if (req.user) {
    const notes = req.user.notes.all;
    res.json({ notes: notes });
  } else {
    res.json("something went wrong");
  }
});

router.get("/notes/stem", (req, res) => {
  if (req.user) {
    const stemNotes = req.user.notes.stem;
    res.json({ notes: stemNotes });
  }
});

router.get("/notes/humanities", (req, res) => {
  if (req.user) {
    const humanitiesNotes = req.user.notes.humanities;
    res.json({ notes: humanitiesNotes });
  }
});

const SUBJECTS = {
  STEM: "stem",
  Humanities: "humanities"
};

router.post("/note/new", async (req, res) => {
  if (req.user) {
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
      console.log(user);
      console.log(user.__proto__);

      await user.save();

      res.json({ note: note });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: err });
    }
  }
});

module.exports = router;

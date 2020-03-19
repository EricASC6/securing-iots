const express = require("express");
const router = express.Router();
const Note = require("../models/note").model;

router.use(express.json());

router.get("/notes/:type", (req, res) => {
  const type = req.params.type;

  if (req.user) {
    const notes = req.user.notes[type];
    res.json({ notes: notes });
  } else {
    res.json("something went wrong");
  }
});

const SUBJECTS = {
  STEM: "stem",
  Humanities: "humanities"
};

router.post("/note/new", async (req, res) => {
  console.log(req.session);

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

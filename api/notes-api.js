const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Note = require("../models/note").model;

router.use(express.json());

const SUBJECTS = {
  STEM: "stem",
  Humanities: "humanities"
};

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

router.post("/new/:id", authenticateUser, async (req, res) => {
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

    res.json("success");
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
});

module.exports = router;

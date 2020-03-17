const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", (req, res) => {
  const id = req.cookies.user_id;
  const validSession = req.session.user._id === id;

  if (validSession) {
    res.render("notes", {
      user: req.session.user
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;

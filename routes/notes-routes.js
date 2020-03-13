const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.user);
  const { googleId } = req.user;
  res.cookie("id", googleId);
  res.render("notes", { user: req.user });
});

module.exports = router;

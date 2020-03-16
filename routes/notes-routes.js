const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.session);
  res.render("notes", { user: req.user });
});

module.exports = router;

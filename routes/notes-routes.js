const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.signedCookies);
  if (req.user && req.signedCookies.user_id) {
    console.log(req.user);

    res.render("notes", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;

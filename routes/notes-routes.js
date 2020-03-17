const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("notes", {
    user: {
      name: "eric chen"
    }
  });
});

module.exports = router;

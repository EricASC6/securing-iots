const express = require("express");
const router = express.Router();

router.post("/new", (req, res) => {
  res.send("hi");
});

module.exports = router;

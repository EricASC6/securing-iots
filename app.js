const express = require("express");

const app = express();

app.listen(3000, () => console.log("Listening on port 3000"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/asdf", (req, res) => {
  res.render("home");
});

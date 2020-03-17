const express = require("express");
const mongoose = require("mongoose");
const keys = require("./keys");
const notesRoutes = require("./routes/notes-routes");
const authRoutes = require("./routes/auth-routes");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const notesApi = require("./api/notes-api");

const app = express();

mongoose.connect(keys.mongodb.dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.once("open", () => console.log("connection to mongodb"));
db.on("error", err => console.log(err));

app.listen(3000, () => console.log("Listening on port 3000"));

app.set("view engine", "ejs");

// set up cookie-parser
app.use(cookieParser("securingiot"));

// set up session
app.use(
  session({
    name: "session_id",
    secret: "securingiot",
    resave: false,
    cookie: {
      maxAge: 36000
    }
  })
);

// routes
app.use("/", express.static(__dirname + "/public"));

app.use("/notes", notesRoutes);
app.use("/auth", authRoutes);

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    else {
      console.log(req.session);
      res.redirect("/login");
    }
  });
});

// Api
app.use("/data", notesApi);

app.get("/", (req, res) => {
  res.render("home");
});

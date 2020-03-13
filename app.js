const express = require("express");
const mongoose = require("mongoose");
const keys = require("./keys");
const passport = require("passport");
const passportSetup = require("./config/passport-setup");
const cookieParser = require("cookie-parser");
const notesRoutes = require("./routes/notes-routes");
const authRoutes = require("./routes/auth-routes");
const cookieSession = require("cookie-session");
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

// set up cookie parser
app.use(cookieParser());

// set up session cookies
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/", express.static(__dirname + "/public"));

app.use("/notes", notesRoutes);
app.use("/auth", authRoutes);

app.get("/login", (req, res) => {
  res.render("login");
});

// Api
app.use("/data/note", notesApi);

app.get("/", (req, res) => {
  res.render("home");
});

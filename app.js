const express = require("express");
const mongoose = require("mongoose");
const keys = require("./keys");
const notesRoutes = require("./routes/notes-routes");
const authRoutes = require("./routes/auth-routes");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const notesApi = require("./api/notes-api");
const User = require("./models/user");

const app = express();

mongoose.connect(keys.MONGODB.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.once("open", () => console.log("connection to mongodb"));
db.on("error", err => console.log(err));

app.listen(3000, () => console.log("Listening on port 3000"));

app.set("view engine", "ejs");

// set up cookie-parser
const COOKIE_SECRET = keys.SESSION.COOKIE_SECRET;
app.use(cookieParser(COOKIE_SECRET));

// set up session
app.use(
  session({
    name: "user_id",
    saveUninitialized: false,
    secret: COOKIE_SECRET,
    resave: false
  })
);

// sends session_id if user is logined
app.use((req, res, next) => {
  if (!req.session || !req.session.userId) {
    res.clearCookie("user_id");
  }

  next();
});

// put user in req.user if sessions are valid
app.use(async (req, res, next) => {
  console.log(req.url);
  if (!(req.signedCookies.user_id && req.session.userId)) {
    return next();
  }

  const id = req.session.userId;
  try {
    const user = await User.findById(id);
    console.log("user", user);
    if (user) req.user = user;
    next();
  } catch (err) {
    console.log(err);
    next();
  }
});

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
      res.clearCookie("user_id");
      res.redirect("/login");
    }
  });
});

// Api
app.use("/data", notesApi);

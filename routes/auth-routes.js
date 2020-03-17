const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const keys = require("../keys");
const fetch = require("node-fetch");
const User = require("../models/user");

const oauth2Client = new google.auth.OAuth2(
  keys.google.clientID,
  keys.google.clientSecret,
  "http://localhost:3000/auth/google/redirect"
);

const googleApi = "https://www.googleapis.com/oauth2/v2/userinfo";

router.get("/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email", "openid"]
  });
  res.redirect(url);
});

const createNewUser = async (name, email, id) => {
  const newUser = new User({
    name: name,
    google: {
      email: email,
      id: id
    },
    notes: {
      all: [],
      stem: [],
      humanities: []
    }
  });

  return await newUser.save();
};

router.get("/google/redirect", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  const { access_token, refresh_token, id_token, token_type } = tokens;
  console.log(id_token);
  const profileData = await fetch(googleApi, {
    headers: {
      Authorization: `${token_type} ${access_token}`
    }
  });

  const profile = await profileData.json();
  console.log(profile);

  const { name, email, id } = profile;

  const existingUser = await User.findOne({
    "google.id": id,
    "google.email": email
  });

  if (existingUser) {
    console.log(existingUser);
    req.session.user = existingUser;
  } else {
    const newUser = await createNewUser(name, email, id);
    req.session.user = newUser;
  }

  console.log("user", req.session.user);
  res.cookie("user_id", req.session.user._id);
  req.session.profile = profile;
  req.session.id_token = id_token;
  console.log("session id", req.session.id);

  res.redirect("/notes");
});

module.exports = router;

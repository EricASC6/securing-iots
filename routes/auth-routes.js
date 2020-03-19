const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const keys = require("../keys");
const fetch = require("node-fetch");
const User = require("../models/user");

const CLIENT_ID = keys.GOOGLE.CLIENT_ID;
const CLIENT_SECRET = keys.GOOGLE.CLIENT_SECRET;
const REDIRECT_URL = "http://localhost:3000/auth/google/redirect";
const GOOGLE_API = "https://www.googleapis.com/oauth2/v2/userinfo";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

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

  return newUser.save();
};

router.get("/google/redirect", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  const { access_token, refresh_token, id_token, token_type } = tokens;

  fetch(GOOGLE_API, {
    method: "GET",
    headers: {
      Authorization: `${token_type} ${access_token}`
    }
  })
    .then(profileData => profileData.json())
    .then(profile => {
      const { name, email, id } = profile;
      User.findOne({ "google.id": id, "google.email": email })
        .exec()
        .then(existingUser => {
          if (existingUser) {
            req.session.userId = existingUser._id;
            res.redirect("/notes");
          } else {
            createNewUser(name, email, id).then(newUser => {
              req.session.userId = newUser._id;
              res.redirect("/notes");
            });
          }
        });
    });
});

module.exports = router;

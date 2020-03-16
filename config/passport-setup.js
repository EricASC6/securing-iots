// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const keys = require("../keys");
// const User = require("../models/user");

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById(id)
//     .exec()
//     .then(user => done(null, user));
// });

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: keys.google.clientID,
//       clientSecret: keys.google.clientSecret,
//       callbackURL: "/auth/google/redirect"
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       console.log(profile);
//       console.log(accessToken);

//       const { displayName, id } = profile;
//       const currentUser = await User.findOne({
//         name: displayName,
//         googleId: id
//       });
//       if (currentUser) {
//         console.log("user", currentUser);
//         done(null, currentUser);
//       } else {
//         const newUser = new User({
//           name: displayName,
//           googleId: id,
//           notes: {
//             all: [],
//             stem: [],
//             humanities: []
//           }
//         });

//         await newUser.save();
//         console.log("new user created", newUser);
//         done(null, user);
//       }
//     }
//   )
// );

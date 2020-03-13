const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const noteSchema = require("./note").schema;

const userSchema = new Schema({
  name: String,
  googleId: String,
  notes: {
    all: [noteSchema],
    stem: [noteSchema],
    humanities: [noteSchema]
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;

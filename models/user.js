const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const noteSchema = require("./note").schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  google: {
    email: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  notes: {
    all: [noteSchema],
    stem: [noteSchema],
    humanities: [noteSchema]
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;

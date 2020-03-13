const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: String,
  type: String,
  description: String
});

const Note = mongoose.model("note", noteSchema);

module.exports = {
  schema: noteSchema,
  model: Note
};

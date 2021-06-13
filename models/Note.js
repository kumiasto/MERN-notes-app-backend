const mongoose = require("mongoose");

const setDate = {
  timestamps: { currentTime: () => new Date() },
};

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title cannot be empty"],
      maxlength: [25, "Title cannot be longer than 25 characters"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content cannot be empty"],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  setDate
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;

const mongoose = require("mongoose");

const setDate = {
  timestamps: { currentTime: () => new Date() },
};

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tytuł nie może być pusty"],
      maxlength: [25, "Tytuł nie może być dłuższy niż 25 znaków"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Notatka nie może być pusta"],
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

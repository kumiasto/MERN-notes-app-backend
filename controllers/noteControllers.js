const Note = require("../models/Note");

function handleNoteErrors(err) {
  let errors = { title: "", content: "" };

  if (err.message.includes("Note validation failed")) {
    Object.values(err.errors).map(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

module.exports.note_post = async (req, res) => {
  const { title, content, user } = req.body;

  try {
    const note = await Note.create({ title, content, user });
    res.status(201).json({ note: note.user });
  } catch (err) {
    const errors = handleNoteErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.note_delete = async (req, res) => {
  const { id } = req.body;

  try {
    const deleteNote = await Note.findOneAndDelete({ _id: id });
    res.status(200).json({ deleteNote });
  } catch (err) {
    console.log(err);
  }
};

module.exports.notes_get = async (req, res) => {
  try {
    const data = await Note.find(
      { user: req.user },
      Note.title,
      Note.content,
      Note.createdAt,
    );
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
};
module.exports.note_get = async (req, res) => {
  const id = req.header("note-id");

  try {
    const data = await Note.findById({ _id: id });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
};

module.exports.note_update = async (req, res) => {
  const { id, content, title } = req.body;
  try {
    const data = await Note.findByIdAndUpdate(
      { _id: id },
      { content, title },
      { runValidators: true }
    );
    res.status(200).json(data);
  } catch (err) {
    const errors = handleNoteErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.note_search = async (req, res) => {
  const user = req.header("user-id");
  const title = req.header("note-title");

  try {
    const data = await Note.find({
      title: { $regex: title, $options: "i" },
      user,
    });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
};

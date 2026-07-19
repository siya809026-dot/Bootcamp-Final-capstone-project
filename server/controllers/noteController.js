import Note from "../models/Note.js";

// CREATE — any logged-in user (Teacher or Student) can create their own note
const createNote = async (req, res) => {
  try {
    const { title, description, subject } = req.body;

    let note = await Note.create({
      title,
      description,
      subject,
      uploadedBy: req.userid,
    });

    note = await note.populate("uploadedBy", "name email role");

    res.status(201).json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ — everyone (Teacher or Student) sees ALL notes.
// Edit/delete permission is enforced separately in updateNote/deleteNote.
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find()
      .populate("uploadedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({ success: true, notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE — Teacher can update any note, Student only their own
const updateNote = async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    const isOwner = note.uploadedBy.toString() === req.userid;
    const isTeacher = req.role === "Teacher";

    if (!isOwner && !isTeacher) {
      return res.status(403).json({ success: false, message: "Not allowed to edit this note" });
    }

    const { title, description, subject } = req.body;
    if (title !== undefined) note.title = title;
    if (description !== undefined) note.description = description;
    if (subject !== undefined) note.subject = subject;

    await note.save();
    note = await note.populate("uploadedBy", "name email role");

    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE — Teacher can delete any note, Student only their own
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    const isOwner = note.uploadedBy.toString() === req.userid;
    const isTeacher = req.role === "Teacher";

    if (!isOwner && !isTeacher) {
      return res.status(403).json({ success: false, message: "Not allowed to delete this note" });
    }

    await note.deleteOne();
    res.json({ success: true, message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export { createNote, getAllNotes, updateNote, deleteNote };
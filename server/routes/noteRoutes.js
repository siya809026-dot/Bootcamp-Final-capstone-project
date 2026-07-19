import express from "express";
import {
    createNote,
    getAllNotes,
    updateNote,
    deleteNote
} from "../controllers/noteController.js";

import auth from "../middleware/auth.js";
import teacher from "../middleware/validate.js";

const router = express.Router();

router.post("/create", auth, teacher, createNote);

router.get("/", auth, getAllNotes);

router.put("/:id", auth, teacher, updateNote);

router.delete("/:id", auth, teacher, deleteNote);

export default router;
import express from "express";
import {
    createNote,
    getAllNotes,
    updateNote,
    deleteNote
} from "../controllers/noteController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/create", auth, createNote);

router.get("/", auth, getAllNotes);

router.put("/:id", auth, updateNote);

router.delete("/:id", auth, deleteNote);

export default router;
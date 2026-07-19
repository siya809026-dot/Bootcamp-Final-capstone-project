import express from "express";
import { searchNotes } from "../controllers/aiController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/search", auth, searchNotes);

export default router;
import { pipeline } from "@xenova/transformers";
import Note from "../models/Note.js";

let embedder = null;
let embedderLoading = null;

async function getEmbedder() {
  if (embedder) return embedder;
  if (!embedderLoading) {
    console.log("[AI] Loading embedding model, please wait (first time may take a while)...");
    embedderLoading = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2")
      .then((model) => {
        embedder = model;
        console.log("[AI] Embedding model loaded successfully.");
        return model;
      })
      .catch((err) => {
        console.error("[AI] Failed to load embedding model:", err.message);
        embedderLoading = null;
        throw err;
      });
  }
  return embedderLoading;
}

async function embedText(text) {
  const model = await getEmbedder();
  const output = await model(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

function cosineSimilarity(a, b) {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot;
}

const searchNotes = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, notes: [] });

    console.log("[AI] Search request received:", q);

    const filter = req.role === "Teacher" ? {} : { uploadedBy: req.userid };
    const notes = await Note.find(filter).populate("uploadedBy", "name email role");

    console.log(`[AI] Found ${notes.length} notes to compare against.`);

    const queryEmbedding = await embedText(q);

    const scored = await Promise.all(
      notes.map(async (note) => {
        const noteEmbedding = await embedText(`${note.title} ${note.description} ${note.subject || ""}`);
        return { note, score: cosineSimilarity(queryEmbedding, noteEmbedding) };
      })
    );

    const results = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map((s) => s.note);

    console.log("[AI] Search complete, returning", results.length, "results.");
    res.json({ success: true, notes: results });
  } catch (err) {
    console.error("[AI] Search failed:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

export { searchNotes, getEmbedder };
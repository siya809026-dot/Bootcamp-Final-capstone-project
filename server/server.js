import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDb from "./config/db.js";
import authRoute from "./routes/authRoutes.js";
import noteRoute from "./routes/noteRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { getEmbedder } from "./controllers/aiController.js";

dotenv.config();

const app = express();

connectDb();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoute);
app.use("/notes", noteRoute);
app.use("/ai", aiRoutes);

app.get("/", (req, res) => {
    res.send("Notes Management Server Running...");
});

const PORT = process.env.PORT;

app.listen(PORT, async () => {
    console.log(`Server Running on Port ${PORT}`);
    try {
        await getEmbedder(); // preload AI model at startup, not on first search
    } catch (err) {
        console.error("Could not preload AI model:", err.message);
    }
});
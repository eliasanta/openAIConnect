import express from "express";
import { createSession } from "../controllers/sessionController.js";
import { transcribe } from "../controllers/transcriptionController.js";
import { cleanUploads } from "../services/fileCleanupService.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Creazione della sessione
router.get("/session", createSession);

// Trascrizione dei file audio con pulizia della cartella
router.post("/transcribe", cleanUploads("uploads"), upload.single("file"), transcribe);

export default router;

import express from "express";
import { createSession } from "../controllers/sessionController.js";
import { transcribe } from "../controllers/transcriptionController.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Funzione per pulire la cartella "uploads"
const cleanUploads = (req, res, next) => {
    const uploadDir = path.join(process.cwd(), "uploads");
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error("Errore durante la lettura della cartella uploads:", err);
            return next(err);
        }
        files.forEach(file => {
            const filePath = path.join(uploadDir, file);
            fs.unlink(filePath, err => {
                if (err) {
                    console.error("Errore durante l'eliminazione del file:", err);
                }
            });
        });
        next(); // Continua con il middleware successivo
    });
};

// Creazione della sessione
router.get("/session", createSession);

// Trascrizione dei file audio con pulizia della cartella
router.post("/transcribe", cleanUploads, upload.single("file"), transcribe);

export default router;

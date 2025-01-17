import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import fetch from "node-fetch";
import { OpenAI } from 'openai';
import { config } from 'dotenv';
import ffmpegPkg from 'fluent-ffmpeg'; // Importa il modulo come pacchetto default
const ffmpeg = ffmpegPkg;
config(); // Carica le variabili d'ambiente dal file .env


// Configurazione dei percorsi per file e directory
const __filename = fileURLToPath(import.meta.url);
const upload = multer({ dest: "uploads/" });
const __dirname = path.dirname(__filename);

// Controllo e caricamento delle variabili d'ambiente
if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY non trovata. Assicurati che sia configurata nel file .env.");
    process.exit(1);
}

const convertWebMToMP3 = async (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .output(outputPath)
            .format('mp3')
            .on('end', () => {
                resolve(outputPath);  // Restituisce il percorso del file convertito
            })
            .on('error', (err) => {
                console.error('Errore nella conversione:', err);
                reject(err);  // Rifiuta la promessa in caso di errore
            })
            .run();
    });
};

const app = express();
app.use(cors());
async function transcribeAudio(filename, apiKey, language = 'it') {
    try {
        // Initialize the OpenAI client with the given API key.
        const openAICLient = new OpenAI({ apiKey });
        // Send the audio file for transcription using the specified model.
        const transcription = await openAICLient.audio.transcriptions.create({
            file: fs.createReadStream(filename),
            model: 'whisper-1',
            language: language
        });
        // Return the transcription result.
        return transcription;
    } catch (error) {
        // Log any errors that occur during transcription.
        console.error('Error', error);
    }
}

// Endpoint per creare una sessione
app.get("/session", async (req, res) => {
    try {
        const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-realtime-preview-2024-12-17",
                instructions: "Sei un amichevole assistente di nome Sara",
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            console.error("Errore API OpenAI:", error);
            res.status(response.status).send(error);
            return;
        }
        const data = await response.json();
        res.send(data);
    } catch (error) {
        console.error("Errore durante la creazione della sessione:", error.message || error);
        res.status(500).send({ error: "Errore interno del server" });
    }
});

// Endpoint per trascrivere un file audio
app.post("/transcribe", upload.single("file"), async (req, res) => {
    try {
        // Controllo che il file sia presente
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "File audio mancante",
            });
        }
        // Controllo che il file sia nel formato corretto
        if (req.file.mimetype !== 'audio/webm') {
            return res.status(400).send({
                success: false,
                message: "Formato del file non supportato. Assicurati di inviare un file audio in formato WebM.",
            });
        }
        const inputPath = req.file.path; // Percorso del file ricevuto
        const outputPath = `${inputPath}.mp3`; // Percorso dove salvare il file convertito
        try {
            // Conversione del file WebM in MP3
            await convertWebMToMP3(inputPath, outputPath);
        } catch (error) {
            console.error('Errore durante la conversione del file:', error);
            return res.status(500).send({
                success: false,
                message: "Errore nella conversione del file audio.",
            });
        }
        try {
            const transcription = await transcribeAudio(outputPath, process.env.OPENAI_API_KEY);
            console.log('Trascrizione ottenuta:', transcription.text);
            if (transcription && transcription.text) {
                return res.status(200).send({
                    success: true,
                    transcription: transcription.text,
                });
            } else {
                return res.status(500).send({
                    success: false,
                    message: "Impossibile ottenere la trascrizione",
                });
            }
        } catch (error) {
            console.error("Errore durante la trascrizione:", error.message || error);
            return res.status(500).send({
                success: false,
                message: "Errore durante la trascrizione dell'audio.",
            });
        }
    } catch (error) {
        console.error("Errore nell'endpoint /transcribe:", error.message || error);
        res.status(500).send({
            success: false,
            message: "Si è verificato un errore durante la trascrizione",
        });
    }
});


// Avvia il server sulla porta 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});

import { convertWebMToMP3 } from "../services/audioService.js";
import { transcribeAudio } from "../services/openAIService.js";
// il middleware upload.single("file") mi fa trovare i dati del file caricato dentro a req.file
export const transcribe = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "File audio mancante",
            });
        }
        if (req.file.mimetype !== 'audio/webm') {
            return res.status(400).send({
                success: false,
                message: "Formato del file non supportato. Assicurati di inviare un file audio in formato WebM.",
            });
        }
        const inputPath = req.file.path;
        const outputPath = `${inputPath}.mp3`;
        // Conversione del file WebM in MP3
        await convertWebMToMP3(inputPath, outputPath);
        // Trascrizione dell'audio
        const transcription = await transcribeAudio(outputPath, process.env.OPENAI_API_KEY);
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
        console.error("Errore nell'endpoint /transcribe:", error.message || error);
        res.status(500).send({
            success: false,
            message: "Si è verificato un errore durante la trascrizione",
        });
    }
};

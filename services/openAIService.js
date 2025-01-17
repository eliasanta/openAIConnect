import { OpenAI } from 'openai';
import fs from "fs";

export const transcribeAudio = async (filename, apiKey, language = 'it') => {
    try {
        const openAICLient = new OpenAI({ apiKey });
        const transcription = await openAICLient.audio.transcriptions.create({
            file: fs.createReadStream(filename),
            model: 'whisper-1',
            language: language
        });
        return transcription;
    } catch (error) {
        console.error('Error', error);
    }
};

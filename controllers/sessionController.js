import fetch from "node-fetch";

export const createSession = async (req, res) => {
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
};

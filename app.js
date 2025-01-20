import express from "express";
import cors from "cors";
import apiRoutes from './routes/apiRoutes.js';
import dotenvFlow from "dotenv-flow";

// Carica le variabili d'ambiente
dotenvFlow.config();
const app = express();
app.use(cors());
app.use(express.json());
// Usa il router definito per le rotte API
app.use("/", apiRoutes);
// Avvia il server sulla porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT} in modalità ${process.env.NODE_ENV}`);
});
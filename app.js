import express from "express";
import cors from "cors";
import { config } from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';

config();
const app = express();
app.use(cors());
app.use(express.json());
// Usa il router definito per le rotte API
app.use("/", apiRoutes);
// Avvia il server sulla porta 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});

# openaiInterface

Un'interfaccia per interagire con OpenAI, che fornisce due endpoint principali:
1. **/session**: Per la creazione di una chiave ephimeral da utilizzare per avviare una sessione con OpenAI lato client.
2. **/transcribe**: Per la trascrizione di audio inviato utilizzando l'API Whisper di OpenAI.

## Configurazione
Prima di avviare l'applicazione, assicurati di configurare correttamente il file `.env`:
- Imposta una chiave API di OpenAI:
  ```env
  OPENAI_API_KEY=la_tua_api_key
  ```

## Esecuzione

L'applicazione può essere eseguita in tre modalità differenti utilizzando gli script definiti in `package.json`:

### Produzione:
Per eseguire l'applicazione in modalità **produzione**, usa il comando:
```bash
npm start 
```

### Sviluppo:
Per eseguire l'applicazione in modalità **produzione**, usa il comando:
```bash
npm run dev
```

### Test:
Per eseguire l'applicazione in modalità **produzione**, usa il comando:
```
npm run test
```
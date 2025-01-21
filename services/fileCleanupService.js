import fs from "fs";
import path from "path";

export const cleanUploads = (uploadDir) => {
    return (req, res, next) => {
        fs.readdir(uploadDir, (err, files) => {
            if (err) {
                console.error("Errore durante la lettura della cartella uploads:", err);
                return next(err);
            }
            if (files.length === 0) {
                return next();
            }
            // Elimina i file nella cartella
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
};

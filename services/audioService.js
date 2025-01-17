import ffmpegPkg from 'fluent-ffmpeg'; 
const ffmpeg = ffmpegPkg;

export const convertWebMToMP3 = async (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .output(outputPath)
            .format('mp3')
            .on('end', () => resolve(outputPath))
            .on('error', (err) => {
                console.error('Errore nella conversione:', err);
                reject(err);
            })
            .run();
    });
};

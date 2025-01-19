import express, { json } from 'express'
import { PORT, TELEGRAM_TOKEN, ID_CANAL } from './src/configs/variables.js'
import { corsMiddleware } from './src/middlewares/cors.js'
import chokidar  from 'chokidar'
import { RUTA_CARPETA } from './src/configs/variables.js'
import TelegramBot from 'node-telegram-bot-api'
import fs from 'fs'
import path from 'path'


const app = express()

app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')
app.listen(PORT, () => {
    console.log(`El servidor esta escuchando en el puerto ${PORT}`);

    const bot = new TelegramBot(TELEGRAM_TOKEN, {polling: true});

    const sendMessageToChannel = async (imagePath) => {
        try {
            const buffer = fs.readFileSync(imagePath);
            const fileOptions = {
                filename: 'customfilename',
                contentType: 'image/jpg',
              };
            await bot.sendPhoto(ID_CANAL, buffer, { 
                caption: 'Hola amor'
            }, fileOptions);
            console.log('Imagen enviada con éxito');
        } catch (error) {
            console.error('Error al enviar la imagen:', error);
        }
    }

    const observador = chokidar.watch(RUTA_CARPETA, {
        ignored: /(^|[\/\\])\../,
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: true,
    });

    observador.on('add', async (path) => {
        try {
            if (/\.(jpg|jpeg|png|gif)$/i.test(path)) {
                console.log(`Nueva imagen detectada: ${path}`);
                sendMessageToChannel(path);
            } else {
                console.log('El archivo no es una imagen');
            }
        } catch (error) {
            console.error('Error al procesar el archivo:', error);
        }
    });
})

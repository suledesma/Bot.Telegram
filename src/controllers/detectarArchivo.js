import fs from 'fs'
import { RUTA_CARPETA } from './src/configs/variables.js'

const carpetaDetectar = RUTA_CARPETA

fs.watch(carpetaDetectar, (eventType, filename) => {
    if (eventType === 'rename' && filename) {
        const imagePath = `${directoryToWatch}/${filename}`;
        console.log(`Se ingreso una imagen ${imagePath}`);
      }
});
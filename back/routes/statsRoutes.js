/**
 * Rutas para gestionar las estadísticas y gráficos generados por Python
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const { verifyToken } = require('../middleware/authMiddleware');

// Directorio donde se guardarán los gráficos generados
const STATS_DIR = path.join(__dirname, '..', 'python');

/**
 * @route POST /api/stats/generate
 * @desc Genera estadísticas para un usuario específico usando Python
 * @access Public
 */
router.post('/generate', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'El email es obligatorio' });
    }
    
    console.log(`Generando estadísticas para: ${email}`);
    
    try {
      // Ejecutar script de Python pasando el email como argumento
      const pythonProcess = spawn('python3', [
        path.join(__dirname, '..', 'python', 'graficos.py'),
        email // Pasar el email como argumento
      ]);
      
      let pythonOutput = '';
      let pythonError = '';
      
      // Capturar la salida del script
      pythonProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(`Python stdout: ${output}`);
        pythonOutput += output;
      });
      
      // Capturar errores
      pythonProcess.stderr.on('data', (data) => {
        const error = data.toString();
        console.error(`Python stderr: ${error}`);
        pythonError += error;
      });
      
      // Manejar errores del proceso
      pythonProcess.on('error', (error) => {
        console.error('Error al ejecutar Python:', error);
        
        if (error.code === 'ENOENT') {
          console.log('Python no está disponible. Usando gráficos existentes...');
          sendSuccessResponse();
        } else {
          return res.status(500).json({ 
            error: 'Error al ejecutar Python',
            details: error.message
          });
        }
      });
      
      // Manejar finalización del proceso
      pythonProcess.on('close', (code) => {
        console.log(`Proceso Python finalizado con código: ${code}`);
        
        if (code !== 0) {
          console.warn('Python terminó con error. Intentando usar gráficos existentes...');
          sendSuccessResponse();
        } else {
          console.log('Python ejecutado correctamente. Enviando respuesta...');
          sendSuccessResponse(pythonOutput);
        }
      });
    } catch (error) {
      console.error('Error al intentar ejecutar Python:', error);
      sendSuccessResponse();
    }
    
    // Función para enviar respuesta exitosa con los gráficos existentes
    function sendSuccessResponse(output = '') {
      // Verificar que los archivos existan
      const graphFiles = [
        'graf1_enemies_avg.png',
        'graf2_bullets_vs_enemies.png',
        'graf3_bullets_used.png'
      ];
      
      const graphPaths = {};
      let allFilesExist = true;
      
      graphFiles.forEach(file => {
        const filePath = path.join(STATS_DIR, file);
        
        if (fs.existsSync(filePath)) {
          // Construir URL relativa para el frontend
          const relativePath = `/python/${file}`;
          const key = file.split('_')[0]; // graf1, graf2, graf3
          graphPaths[key] = relativePath;
        } else {
          console.warn(`Archivo no encontrado: ${filePath}`);
          allFilesExist = false;
        }
      });
      
      if (!allFilesExist) {
        console.warn('No se encontraron todos los archivos de gráficos');
      }
      
      // Extraer datos de resumen del output o usar datos simulados
      const summaryData = output ? extractSummaryData(output) : {
        totalGames: 4,
        totalEnemies: 90,
        totalBullets: 230,
        totalPlayTime: 650,
        efficiency: 0.39
      };
      
      res.json({
        success: true,
        message: `Estadísticas para ${email}`,
        output: output || "Usando gráficos existentes. Python no está disponible en el servidor.",
        graphPaths,
        summaryData
      });
    }
    
  } catch (error) {
    console.error('Error al generar estadísticas:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

/**
 * Extrae datos de resumen de la salida del script Python
 * @param {string} output - Salida del script Python
 * @returns {Object} Datos de resumen
 */
function extractSummaryData(output) {
  const summary = {
    totalGames: 0,
    totalEnemies: 0,
    totalBullets: 0,
    totalPlayTime: 0,
    efficiency: 0
  };
  
  try {
    // Extraer datos del resumen usando expresiones regulares
    const totalGamesMatch = output.match(/Total de partidas: (\d+)/);
    const totalEnemiesMatch = output.match(/Total de enemigos derrotados: (\d+)/);
    const totalBulletsMatch = output.match(/Total de balas utilizadas: (\d+)/);
    const totalPlayTimeMatch = output.match(/Tiempo total de juego: (\d+)/);
    const efficiencyMatch = output.match(/Eficiencia \(enemigos\/bala\): ([\d.]+)/);
    
    if (totalGamesMatch) summary.totalGames = parseInt(totalGamesMatch[1]);
    if (totalEnemiesMatch) summary.totalEnemies = parseInt(totalEnemiesMatch[1]);
    if (totalBulletsMatch) summary.totalBullets = parseInt(totalBulletsMatch[1]);
    if (totalPlayTimeMatch) summary.totalPlayTime = parseInt(totalPlayTimeMatch[1]);
    if (efficiencyMatch) summary.efficiency = parseFloat(efficiencyMatch[1]);
  } catch (error) {
    console.error('Error al extraer datos de resumen:', error);
  }
  
  return summary;
}

module.exports = router;

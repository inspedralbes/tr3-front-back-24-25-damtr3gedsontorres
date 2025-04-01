// Importar todos los modelos de MongoDB
const Game = require('./Game');
const Statistics = require('./Statistics');

// Exportar los modelos para que puedan ser utilizados en otras partes de la aplicación
module.exports = {
  Game,
  Statistics
};

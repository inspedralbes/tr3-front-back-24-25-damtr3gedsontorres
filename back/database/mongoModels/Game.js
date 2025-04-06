const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  game_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  play_time: { type: Number, required: true }, // Tiempo jugado en segundos
  enemies_defeated: { type: Number, default: 0 },
  user_email: { type: String, required: true }, // Correo del jugador
  last_login: { type: Date, required: true },
  bullets_used: { type: Number, default: 0 },
  score: { type: Number, default: 0 } // Puntuación del jugador
});

module.exports = mongoose.model("Game", gameSchema);

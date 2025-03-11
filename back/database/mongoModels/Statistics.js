const mongoose = require("mongoose");

const statisticsSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  total_games_played: { type: Number, default: 0 },
  total_waves_completed: { type: Number, default: 0 },
  highest_score: { type: Number, default: 0 },
  favorite_weapon: { weapon_id: Number, uses: Number },
  favorite_enemy: { enemy_id: Number, defeated: Number },
  last_login: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Statistics", statisticsSchema);

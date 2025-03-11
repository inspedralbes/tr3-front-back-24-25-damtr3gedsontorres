const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  score: { type: Number, default: 0 },
  waves_completed: { type: Number, default: 0 },
  start_time: { type: Date, default: Date.now },
  end_time: { type: Date },
  enemies_defeated: [
    { enemy_id: Number, count: Number }
  ],
  weapons_used: [
    { weapon_id: Number, hits: Number }
  ]
});

module.exports = mongoose.model("Game", gameSchema);

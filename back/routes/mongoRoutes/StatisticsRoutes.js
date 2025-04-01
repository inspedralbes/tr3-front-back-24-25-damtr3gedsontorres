const express = require("express");
const { Statistics } = require("../../database/mongoModels");

const router = express.Router();

// Crear un nuevo registro de estadísticas
router.post("/", async (req, res) => {
  try {
    const statistics = await Statistics.create(req.body);
    res.status(201).json(statistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el registro de estadísticas" });
  }
});

// Obtener todos los registros de estadísticas
router.get("/", async (req, res) => {
  try {
    const statistics = await Statistics.find();
    res.json(statistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los registros de estadísticas" });
  }
});

// Obtener estadísticas por ID
router.get("/:id", async (req, res) => {
  try {
    const statistics = await Statistics.findById(req.params.id);
    if (!statistics) {
      return res.status(404).json({ error: "Registro de estadísticas no encontrado" });
    }
    res.json(statistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el registro de estadísticas" });
  }
});

// Obtener estadísticas por ID de usuario
router.get("/user/:userId", async (req, res) => {
  try {
    const statistics = await Statistics.findOne({ user_id: req.params.userId });
    
    if (!statistics) {
      // Si no existe, crear un registro de estadísticas vacío para el usuario
      const newStatistics = await Statistics.create({
        user_id: parseInt(req.params.userId),
        total_games_played: 0,
        total_waves_completed: 0,
        highest_score: 0,
        favorite_weapon: { weapon_id: 0, uses: 0 },
        favorite_enemy: { enemy_id: 0, defeated: 0 },
        last_login: new Date()
      });
      
      return res.status(201).json(newStatistics);
    }
    
    res.json(statistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las estadísticas del usuario" });
  }
});

// Actualizar estadísticas
router.put("/:id", async (req, res) => {
  try {
    const statistics = await Statistics.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!statistics) {
      return res.status(404).json({ error: "Registro de estadísticas no encontrado" });
    }
    
    res.json(statistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el registro de estadísticas" });
  }
});

// Actualizar estadísticas específicas
router.patch("/user/:userId", async (req, res) => {
  try {
    let statistics = await Statistics.findOne({ user_id: req.params.userId });
    
    if (!statistics) {
      // Si no existe, crear un nuevo registro
      statistics = await Statistics.create({
        user_id: parseInt(req.params.userId),
        total_games_played: 0,
        total_waves_completed: 0,
        highest_score: 0,
        favorite_weapon: { weapon_id: 0, uses: 0 },
        favorite_enemy: { enemy_id: 0, defeated: 0 },
        last_login: new Date()
      });
    }
    
    // Actualizar solo los campos proporcionados
    const allowedFields = [
      'total_games_played', 
      'total_waves_completed', 
      'highest_score', 
      'favorite_weapon', 
      'favorite_enemy',
      'last_login'
    ];
    
    const updates = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    // Si hay actualizaciones, aplicarlas
    if (Object.keys(updates).length > 0) {
      statistics = await Statistics.findOneAndUpdate(
        { user_id: req.params.userId },
        { $set: updates },
        { new: true, runValidators: true }
      );
    }
    
    res.json(statistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar las estadísticas del usuario" });
  }
});

// Actualizar después de una partida
router.patch("/user/:userId/game-completed", async (req, res) => {
  try {
    const { score, waves_completed, weapons_used, enemies_defeated } = req.body;
    
    let statistics = await Statistics.findOne({ user_id: req.params.userId });
    
    if (!statistics) {
      // Si no existe, crear un nuevo registro
      statistics = await Statistics.create({
        user_id: parseInt(req.params.userId),
        total_games_played: 1,
        total_waves_completed: waves_completed || 0,
        highest_score: score || 0,
        favorite_weapon: { weapon_id: 0, uses: 0 },
        favorite_enemy: { enemy_id: 0, defeated: 0 },
        last_login: new Date()
      });
    } else {
      // Actualizar estadísticas existentes
      const updates = {
        total_games_played: statistics.total_games_played + 1,
        total_waves_completed: statistics.total_waves_completed + (waves_completed || 0),
        last_login: new Date()
      };
      
      // Actualizar puntuación más alta si es necesario
      if (score && score > statistics.highest_score) {
        updates.highest_score = score;
      }
      
      // Actualizar arma favorita si se proporciona
      if (weapons_used && weapons_used.length > 0) {
        // Encontrar el arma más usada en esta partida
        const weaponCounts = {};
        weapons_used.forEach(weapon => {
          const weaponId = weapon.weapon_id;
          weaponCounts[weaponId] = (weaponCounts[weaponId] || 0) + weapon.hits;
        });
        
        const mostUsedWeapon = Object.keys(weaponCounts).reduce((a, b) => 
          weaponCounts[a] > weaponCounts[b] ? a : b
        );
        
        // Comparar con el arma favorita actual
        if (weaponCounts[mostUsedWeapon] > (statistics.favorite_weapon?.uses || 0)) {
          updates.favorite_weapon = {
            weapon_id: parseInt(mostUsedWeapon),
            uses: weaponCounts[mostUsedWeapon]
          };
        }
      }
      
      // Actualizar enemigo favorito si se proporciona
      if (enemies_defeated && enemies_defeated.length > 0) {
        // Encontrar el enemigo más derrotado en esta partida
        const enemyCounts = {};
        enemies_defeated.forEach(enemy => {
          const enemyId = enemy.enemy_id;
          enemyCounts[enemyId] = (enemyCounts[enemyId] || 0) + enemy.count;
        });
        
        const mostDefeatedEnemy = Object.keys(enemyCounts).reduce((a, b) => 
          enemyCounts[a] > enemyCounts[b] ? a : b
        );
        
        // Comparar con el enemigo favorito actual
        if (enemyCounts[mostDefeatedEnemy] > (statistics.favorite_enemy?.defeated || 0)) {
          updates.favorite_enemy = {
            enemy_id: parseInt(mostDefeatedEnemy),
            defeated: enemyCounts[mostDefeatedEnemy]
          };
        }
      }
      
      // Aplicar actualizaciones
      statistics = await Statistics.findOneAndUpdate(
        { user_id: req.params.userId },
        { $set: updates },
        { new: true, runValidators: true }
      );
    }
    
    res.json(statistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar las estadísticas después de la partida" });
  }
});

// Eliminar estadísticas
router.delete("/:id", async (req, res) => {
  try {
    const statistics = await Statistics.findByIdAndDelete(req.params.id);
    
    if (!statistics) {
      return res.status(404).json({ error: "Registro de estadísticas no encontrado" });
    }
    
    res.json({ message: "Registro de estadísticas eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el registro de estadísticas" });
  }
});

// Obtener ranking de usuarios por puntuación más alta
router.get("/ranking/score", async (req, res) => {
  try {
    const topStatistics = await Statistics.find()
      .sort({ highest_score: -1 })
      .limit(10);
    
    res.json(topStatistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el ranking de puntuaciones" });
  }
});

// Obtener ranking de usuarios por partidas jugadas
router.get("/ranking/games", async (req, res) => {
  try {
    const topStatistics = await Statistics.find()
      .sort({ total_games_played: -1 })
      .limit(10);
    
    res.json(topStatistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el ranking de partidas jugadas" });
  }
});

module.exports = router;

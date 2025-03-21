const express = require("express");
const { Player } = require("../../database/sqlModels");

const router = express.Router();

// Crear un perfil de jugador
router.post("/", async (req, res) => {
  try {
    const player = await Player.create(req.body);
    res.status(201).json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el perfil de jugador" });
  }
});

// Obtener todos los perfiles de jugador
router.get("/", async (req, res) => {
  try {
    const players = await Player.findAll();
    res.json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los perfiles de jugador" });
  }
});

// Obtener un perfil de jugador por ID
router.get("/:id", async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) {
      return res.status(404).json({ error: "Perfil de jugador no encontrado" });
    }
    res.json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el perfil de jugador" });
  }
});

// Obtener un perfil de jugador por nombre de usuario
router.get("/username/:username", async (req, res) => {
  try {
    const player = await Player.findOne({
      where: { username: req.params.username }
    });
    if (!player) {
      return res.status(404).json({ error: "Perfil de jugador no encontrado" });
    }
    res.json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el perfil de jugador" });
  }
});

// Actualizar un perfil de jugador
router.put("/:id", async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) {
      return res.status(404).json({ error: "Perfil de jugador no encontrado" });
    }
    await player.update(req.body);
    res.json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el perfil de jugador" });
  }
});

// Actualizar estadísticas del jugador (nivel, experiencia, salud, etc.)
router.patch("/:id/stats", async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) {
      return res.status(404).json({ error: "Perfil de jugador no encontrado" });
    }
    
    // Solo permitir actualizar estadísticas específicas
    const allowedFields = ['level', 'experience', 'health', 'maxHealth', 'attack', 'defense', 'speed', 'currentWave', 'highestWave'];
    const updates = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    await player.update(updates);
    res.json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar las estadísticas del jugador" });
  }
});

// Eliminar un perfil de jugador
router.delete("/:id", async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) {
      return res.status(404).json({ error: "Perfil de jugador no encontrado" });
    }
    await player.destroy();
    res.json({ message: "Perfil de jugador eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el perfil de jugador" });
  }
});

// Obtener ranking de jugadores por nivel
router.get("/ranking/level", async (req, res) => {
  try {
    const players = await Player.findAll({
      order: [
        ['level', 'DESC'],
        ['experience', 'DESC']
      ],
      limit: 10
    });
    res.json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el ranking de jugadores" });
  }
});

// Obtener ranking de jugadores por ola más alta alcanzada
router.get("/ranking/wave", async (req, res) => {
  try {
    const players = await Player.findAll({
      order: [
        ['highestWave', 'DESC'],
        ['level', 'DESC']
      ],
      limit: 10
    });
    res.json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el ranking de jugadores por ola" });
  }
});

module.exports = router;

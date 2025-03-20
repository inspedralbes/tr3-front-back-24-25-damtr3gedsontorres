const express = require("express");
const { Enemy } = require("../../database/sqlModels");

const router = express.Router();

// Crear un enemigo
router.post("/", async (req, res) => {
  try {
    // Validación básica
    const { name, health, attack, speed, reward } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "El nombre del enemigo es obligatorio" });
    }
    
    // Asegurarse de que todos los campos sean números
    const enemyData = {
      name,
      health: health ? Number(health) : 100,
      attack: attack ? Number(attack) : 10,
      speed: speed ? Number(speed) : 1.0,
      reward: reward ? Number(reward) : 50
    };
    
    console.log("Intentando crear enemigo:", enemyData);
    
    const enemy = await Enemy.create(enemyData);
    res.status(201).json(enemy);
  } catch (error) {
    console.error("Error detallado al crear enemigo:", error);
    res.status(500).json({
      error: "Error al crear el enemigo",
      details: error.message
    });
  }
});

// Obtener todos los enemigos
router.get("/", async (req, res) => {
  try {
    const enemies = await Enemy.findAll();
    res.json(enemies);
  } catch (error) {
    console.error("Error al obtener enemigos:", error);
    res.status(500).json({
      error: "Error al obtener los enemigos",
      details: error.message
    });
  }
});

// Obtener un enemigo por ID
router.get("/:id", async (req, res) => {
  try {
    const enemy = await Enemy.findByPk(req.params.id);
    if (!enemy) {
      return res.status(404).json({ error: "Enemigo no encontrado" });
    }
    res.json(enemy);
  } catch (error) {
    console.error("Error al obtener enemigo:", error);
    res.status(500).json({
      error: "Error al obtener el enemigo",
      details: error.message
    });
  }
});

// Actualizar un enemigo
router.put("/:id", async (req, res) => {
  try {
    const enemy = await Enemy.findByPk(req.params.id);
    if (!enemy) {
      return res.status(404).json({ error: "Enemigo no encontrado" });
    }
    
    // Validación básica
    const { name, health, attack, speed, reward } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "El nombre del enemigo es obligatorio" });
    }
    
    // Asegurarse de que todos los campos sean números
    const enemyData = {
      name,
      health: health !== undefined ? Number(health) : enemy.health,
      attack: attack !== undefined ? Number(attack) : enemy.attack,
      speed: speed !== undefined ? Number(speed) : enemy.speed,
      reward: reward !== undefined ? Number(reward) : enemy.reward
    };
    
    await enemy.update(enemyData);
    res.json(enemy);
  } catch (error) {
    console.error("Error al actualizar enemigo:", error);
    res.status(500).json({
      error: "Error al actualizar el enemigo",
      details: error.message
    });
  }
});

// Eliminar un enemigo
router.delete("/:id", async (req, res) => {
  try {
    const enemy = await Enemy.findByPk(req.params.id);
    if (!enemy) {
      return res.status(404).json({ error: "Enemigo no encontrado" });
    }
    await enemy.destroy();
    res.json({ message: "Enemigo eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar enemigo:", error);
    res.status(500).json({
      error: "Error al eliminar el enemigo",
      details: error.message
    });
  }
});

module.exports = router;
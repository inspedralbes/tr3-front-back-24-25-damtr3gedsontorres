const express = require("express");
const { Enemy } = require("../database/sqlModels");

const router = express.Router();

// Crear un enemigo
router.post("/", async (req, res) => {
  try {
    const enemy = await Enemy.create(req.body);
    res.status(201).json(enemy);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el enemigo" });
  }
});

// Obtener todos los enemigos
router.get("/", async (req, res) => {
  try {
    const enemies = await Enemy.findAll();
    res.json(enemies);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los enemigos" });
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
    res.status(500).json({ error: "Error al obtener el enemigo" });
  }
});

// Actualizar un enemigo
router.put("/:id", async (req, res) => {
  try {
    const enemy = await Enemy.findByPk(req.params.id);
    if (!enemy) {
      return res.status(404).json({ error: "Enemigo no encontrado" });
    }
    await enemy.update(req.body);
    res.json(enemy);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el enemigo" });
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
    res.status(500).json({ error: "Error al eliminar el enemigo" });
  }
});

module.exports = router;

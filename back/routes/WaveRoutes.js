const express = require("express");
const { Wave, Enemy } = require("../database/sqlModels");

const router = express.Router();

// Crear una oleada
router.post("/", async (req, res) => {
  try {
    const wave = await Wave.create(req.body);
    res.status(201).json(wave);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la oleada" });
  }
});

// Obtener todas las oleadas
router.get("/", async (req, res) => {
  try {
    const waves = await Wave.findAll({
      include: [{ model: Enemy }]
    });
    res.json(waves);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las oleadas" });
  }
});

// Obtener oleadas por nivel de dificultad
router.get("/difficulty/:level", async (req, res) => {
  try {
    const waves = await Wave.findAll({
      where: { difficultyLevel: req.params.level },
      include: [{ model: Enemy }]
    });
    res.json(waves);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las oleadas por dificultad" });
  }
});

// Obtener una oleada por ID
router.get("/:id", async (req, res) => {
  try {
    const wave = await Wave.findByPk(req.params.id, {
      include: [{ model: Enemy }]
    });
    if (!wave) {
      return res.status(404).json({ error: "Oleada no encontrada" });
    }
    res.json(wave);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la oleada" });
  }
});

// Actualizar una oleada
router.put("/:id", async (req, res) => {
  try {
    const wave = await Wave.findByPk(req.params.id);
    if (!wave) {
      return res.status(404).json({ error: "Oleada no encontrada" });
    }
    await wave.update(req.body);
    res.json(wave);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la oleada" });
  }
});

// Eliminar una oleada
router.delete("/:id", async (req, res) => {
  try {
    const wave = await Wave.findByPk(req.params.id);
    if (!wave) {
      return res.status(404).json({ error: "Oleada no encontrada" });
    }
    await wave.destroy();
    res.json({ message: "Oleada eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la oleada" });
  }
});

module.exports = router;

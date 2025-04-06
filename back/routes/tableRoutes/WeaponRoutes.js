const express = require("express");
const { Weapon } = require("../../database/sqlModels");

const router = express.Router();

// Crear un arma
router.post("/", async (req, res) => {
  try {
    const weapon = await Weapon.create(req.body);
    res.status(201).json(weapon);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el arma" });
  }
});

// Obtener todas las armas
router.get("/", async (req, res) => {
  try {
    const weapons = await Weapon.findAll();
    res.json(weapons);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las armas" });
  }
});

// Obtener armas por rareza
router.get("/rarity/:rarity", async (req, res) => {
  try {
    const weapons = await Weapon.findAll({
      where: { rarity: req.params.rarity }
    });
    res.json(weapons);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las armas por rareza" });
  }
});

// Obtener un arma por ID
router.get("/:id", async (req, res) => {
  try {
    const weapon = await Weapon.findByPk(req.params.id);
    if (!weapon) {
      return res.status(404).json({ error: "Arma no encontrada" });
    }
    res.json(weapon);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el arma" });
  }
});

// Actualizar un arma
router.put("/:id", async (req, res) => {
  try {
    const weapon = await Weapon.findByPk(req.params.id);
    if (!weapon) {
      return res.status(404).json({ error: "Arma no encontrada" });
    }
    await weapon.update(req.body);
    res.json(weapon);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el arma" });
  }
});

// Eliminar un arma
router.delete("/:id", async (req, res) => {
  try {
    const weapon = await Weapon.findByPk(req.params.id);
    if (!weapon) {
      return res.status(404).json({ error: "Arma no encontrada" });
    }
    await weapon.destroy();
    res.json({ message: "Arma eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el arma" });
  }
});

module.exports = router;

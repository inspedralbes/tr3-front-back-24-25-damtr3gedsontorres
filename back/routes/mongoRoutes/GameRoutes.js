const express = require("express");
const { Game } = require("../../database/mongoModels");

const router = express.Router();

// Crear un nuevo registro de partida
router.post("/", async (req, res) => {
  try {
    const game = await Game.create(req.body);
    res.status(201).json(game);
  } catch (error) {
    console.error("Error al crear el registro de partida:", error);
    res.status(500).json({ error: "Error al crear el registro de partida", details: error.message });
  }
});

// Obtener todos los registros de partidas
router.get("/", async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    console.error("Error al obtener registros de partidas:", error);
    res.status(500).json({ error: "Error al obtener los registros de partidas", details: error.message });
  }
});

// Obtener un registro de partida por ID
router.get("/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: "Registro de partida no encontrado" });
    }
    res.json(game);
  } catch (error) {
    console.error("Error al obtener el registro de partida:", error);
    res.status(500).json({ error: "Error al obtener el registro de partida", details: error.message });
  }
});

// Obtener partidas por correo de usuario
router.get("/user/:email", async (req, res) => {
  try {
    const games = await Game.find({ user_email: req.params.email });
    res.json(games);
  } catch (error) {
    console.error("Error al obtener partidas del usuario:", error);
    res.status(500).json({ error: "Error al obtener las partidas del usuario", details: error.message });
  }
});

// Actualizar un registro de partida por ID
router.put("/:id", async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!game) {
      return res.status(404).json({ error: "Registro de partida no encontrado" });
    }
    res.json(game);
  } catch (error) {
    console.error("Error al actualizar el registro de partida:", error);
    res.status(500).json({ error: "Error al actualizar el registro de partida", details: error.message });
  }
});

// Eliminar un registro de partida por ID
router.delete("/:id", async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) {
      return res.status(404).json({ error: "Registro de partida no encontrado" });
    }
    res.json({ message: "Registro de partida eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el registro de partida:", error);
    res.status(500).json({ error: "Error al eliminar el registro de partida", details: error.message });
  }
});

module.exports = router;

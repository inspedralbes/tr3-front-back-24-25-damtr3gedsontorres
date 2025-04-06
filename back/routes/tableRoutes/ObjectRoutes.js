const express = require("express");
const { Object } = require("../../database/sqlModels");
const { Op } = require("sequelize");

const router = express.Router();

// Crear un objeto
router.post("/", async (req, res) => {
  try {
    const object = await Object.create(req.body);
    res.status(201).json(object);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el objeto" });
  }
});

// Obtener todos los objetos
router.get("/", async (req, res) => {
  try {
    const objects = await Object.findAll();
    res.json(objects);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los objetos" });
  }
});

// Obtener objeto por nombre (devuelve solo un objeto)
router.get("/name/:name", async (req, res) => {
  try {
    const object = await Object.findOne({
      where: {
        name: {
          [Op.like]: `%${req.params.name}%`
        }
      }
    });

    if (!object) {
      return res.status(404).json({ error: "No se encontró un objeto con ese nombre" });
    }

    res.json(object);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar el objeto por nombre" });
  }
});


// Obtener un objeto por ID
router.get("/:id", async (req, res) => {
  try {
    const object = await Object.findByPk(req.params.id);
    if (!object) {
      return res.status(404).json({ error: "Objeto no encontrado" });
    }
    res.json(object);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el objeto" });
  }
});

// Actualizar un objeto
router.put("/:id", async (req, res) => {
  try {
    const object = await Object.findByPk(req.params.id);
    if (!object) {
      return res.status(404).json({ error: "Objeto no encontrado" });
    }
    await object.update(req.body);
    res.json(object);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el objeto" });
  }
});

// Eliminar un objeto
router.delete("/:id", async (req, res) => {
  try {
    const object = await Object.findByPk(req.params.id);
    if (!object) {
      return res.status(404).json({ error: "Objeto no encontrado" });
    }
    await object.destroy();
    res.json({ message: "Objeto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el objeto" });
  }
});

module.exports = router;
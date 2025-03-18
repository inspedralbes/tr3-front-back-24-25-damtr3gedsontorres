const express = require("express");
const { Shop } = require("../database/sqlModels");
const { Op } = require("sequelize");

const router = express.Router();

// Crear un item de tienda
router.post("/", async (req, res) => {
  try {
    const shopItem = await Shop.create(req.body);
    res.status(201).json(shopItem);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el item de tienda" });
  }
});

// Obtener todos los items de tienda
router.get("/", async (req, res) => {
  try {
    const shopItems = await Shop.findAll();
    res.json(shopItems);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los items de tienda" });
  }
});

// Obtener items de tienda con stock disponible
router.get("/available", async (req, res) => {
  try {
    const shopItems = await Shop.findAll({
      where: {
        stock: {
          [Op.gt]: 0 // Mayor que 0
        }
      }
    });
    res.json(shopItems);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los items disponibles" });
  }
});

// Obtener un item de tienda por ID
router.get("/:id", async (req, res) => {
  try {
    const shopItem = await Shop.findByPk(req.params.id);
    if (!shopItem) {
      return res.status(404).json({ error: "Item de tienda no encontrado" });
    }
    res.json(shopItem);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el item de tienda" });
  }
});

// Actualizar un item de tienda
router.put("/:id", async (req, res) => {
  try {
    const shopItem = await Shop.findByPk(req.params.id);
    if (!shopItem) {
      return res.status(404).json({ error: "Item de tienda no encontrado" });
    }
    await shopItem.update(req.body);
    res.json(shopItem);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el item de tienda" });
  }
});

// Actualizar el stock de un item de tienda
router.patch("/:id/stock", async (req, res) => {
  try {
    const { stock } = req.body;
    if (stock === undefined) {
      return res.status(400).json({ error: "El stock es requerido" });
    }
    
    const shopItem = await Shop.findByPk(req.params.id);
    if (!shopItem) {
      return res.status(404).json({ error: "Item de tienda no encontrado" });
    }
    
    await shopItem.update({ stock });
    res.json(shopItem);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el stock del item" });
  }
});

// Eliminar un item de tienda
router.delete("/:id", async (req, res) => {
  try {
    const shopItem = await Shop.findByPk(req.params.id);
    if (!shopItem) {
      return res.status(404).json({ error: "Item de tienda no encontrado" });
    }
    await shopItem.destroy();
    res.json({ message: "Item de tienda eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el item de tienda" });
  }
});

module.exports = router;

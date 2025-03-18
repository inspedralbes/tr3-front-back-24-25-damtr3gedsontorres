const express = require("express");
const { Inventory, User, Shop } = require("../database/sqlModels");

const router = express.Router();

// Crear un item de inventario
router.post("/", async (req, res) => {
  try {
    const inventory = await Inventory.create(req.body);
    res.status(201).json(inventory);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el item de inventario" });
  }
});

// Obtener todos los items de inventario
router.get("/", async (req, res) => {
  try {
    const inventoryItems = await Inventory.findAll({
      include: [
        { model: User, attributes: ['id', 'username'] },
        { model: Shop, attributes: ['id', 'name', 'price'] }
      ]
    });
    res.json(inventoryItems);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los items de inventario" });
  }
});

// Obtener items de inventario por usuario
router.get("/user/:userId", async (req, res) => {
  try {
    const inventoryItems = await Inventory.findAll({
      where: { UserId: req.params.userId },
      include: [{ model: Shop, attributes: ['id', 'name', 'price', 'description'] }]
    });
    res.json(inventoryItems);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los items de inventario del usuario" });
  }
});

// Obtener un item de inventario por ID
router.get("/:id", async (req, res) => {
  try {
    const inventory = await Inventory.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'username'] },
        { model: Shop, attributes: ['id', 'name', 'price'] }
      ]
    });
    if (!inventory) {
      return res.status(404).json({ error: "Item de inventario no encontrado" });
    }
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el item de inventario" });
  }
});

// Actualizar un item de inventario
router.put("/:id", async (req, res) => {
  try {
    const inventory = await Inventory.findByPk(req.params.id);
    if (!inventory) {
      return res.status(404).json({ error: "Item de inventario no encontrado" });
    }
    await inventory.update(req.body);
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el item de inventario" });
  }
});

// Eliminar un item de inventario
router.delete("/:id", async (req, res) => {
  try {
    const inventory = await Inventory.findByPk(req.params.id);
    if (!inventory) {
      return res.status(404).json({ error: "Item de inventario no encontrado" });
    }
    await inventory.destroy();
    res.json({ message: "Item de inventario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el item de inventario" });
  }
});

module.exports = router;
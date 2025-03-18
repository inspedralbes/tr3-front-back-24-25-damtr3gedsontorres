const express = require("express");
const { Purchase, User, Shop } = require("../database/sqlModels");

const router = express.Router();

// Crear una compra
router.post("/", async (req, res) => {
  try {
    const purchase = await Purchase.create(req.body);
    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la compra" });
  }
});

// Obtener todas las compras
router.get("/", async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      include: [
        { model: User, attributes: ['id', 'username'] },
        { model: Shop, attributes: ['id', 'name', 'price'] }
      ]
    });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las compras" });
  }
});

// Obtener compras por usuario
router.get("/user/:userId", async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      where: { UserId: req.params.userId },
      include: [{ model: Shop, attributes: ['id', 'name', 'price', 'description'] }]
    });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las compras del usuario" });
  }
});

// Obtener una compra por ID
router.get("/:id", async (req, res) => {
  try {
    const purchase = await Purchase.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'username'] },
        { model: Shop, attributes: ['id', 'name', 'price'] }
      ]
    });
    if (!purchase) {
      return res.status(404).json({ error: "Compra no encontrada" });
    }
    res.json(purchase);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la compra" });
  }
});

// Actualizar una compra
router.put("/:id", async (req, res) => {
  try {
    const purchase = await Purchase.findByPk(req.params.id);
    if (!purchase) {
      return res.status(404).json({ error: "Compra no encontrada" });
    }
    await purchase.update(req.body);
    res.json(purchase);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la compra" });
  }
});

// Eliminar una compra
router.delete("/:id", async (req, res) => {
  try {
    const purchase = await Purchase.findByPk(req.params.id);
    if (!purchase) {
      return res.status(404).json({ error: "Compra no encontrada" });
    }
    await purchase.destroy();
    res.json({ message: "Compra eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la compra" });
  }
});

module.exports = router;

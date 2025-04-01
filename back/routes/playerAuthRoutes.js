const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Player } = require('../database/sqlModels');
const { Op } = require('sequelize');

const router = express.Router();

/**
 * @route POST /api/player-auth/register
 * @desc Registrar un nuevo jugador
 * @access Public
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // Validar datos
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    
    // Verificar si el jugador ya existe
    const existingPlayer = await Player.findOne({ 
      where: { 
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });
    
    if (existingPlayer) {
      return res.status(400).json({ error: 'El nombre de usuario o email ya está en uso' });
    }
    
    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Crear jugador
    const player = await Player.create({
      username,
      password: hashedPassword,
      email
    });
    
    // Crear token JWT
    const token = jwt.sign(
      { id: player.id, username: player.username },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '30d' } // Tokens más duraderos para juegos
    );
    
    // Devolver respuesta sin incluir la contraseña
    const playerResponse = {
      id: player.id,
      username: player.username,
      email: player.email,
    };
    
    res.status(201).json({
      message: 'Jugador registrado correctamente',
      player: playerResponse,
      token
    });
  } catch (error) {
    console.error('Error al registrar jugador:', error);
    res.status(500).json({ error: 'Error al registrar jugador' });
  }
});

/**
 * @route POST /api/player-auth/login
 * @desc Iniciar sesión como jugador
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validar datos
    if (!username || !password) {
      return res.status(400).json({ error: 'Nombre de usuario y contraseña son obligatorios' });
    }
    
    // Buscar jugador
    const player = await Player.findOne({ where: { username } });
    
    if (!player) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, player.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Crear token JWT
    const token = jwt.sign(
      { id: player.id, username: player.username },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '30d' } // Tokens más duraderos para juegos
    );
    
    // Devolver respuesta sin incluir la contraseña
    const playerResponse = {
      username: player.username,
      email: player.email,
    };
    
    res.json({
      message: 'Inicio de sesión exitoso',
      player: playerResponse,
      token
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

/**
 * @route GET /api/player-auth/validate-token
 * @desc Validar token de jugador
 * @access Public
 */
router.get('/validate-token', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ valid: false, error: 'No se proporcionó token' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      const player = await Player.findByPk(decoded.id);
      
      if (!player) {
        return res.status(404).json({ valid: false, error: 'Jugador no encontrado' });
      }
      
      // Devolver respuesta sin incluir la contraseña
      const playerResponse = {
        id: player.id,
        username: player.username
      };
      
      res.json({
        valid: true,
        player: playerResponse
      });
    } catch (error) {
      return res.status(401).json({ valid: false, error: 'Token inválido o expirado' });
    }
  } catch (error) {
    console.error('Error al validar token:', error);
    res.status(500).json({ valid: false, error: 'Error al validar token' });
  }
});

module.exports = router;

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../database/sqlModels');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { Op } = require('sequelize');

const router = express.Router();

/**
 * @route POST /api/auth/register-first-admin
 * @desc Registrar el primer administrador (solo si no existe ninguno)
 * @access Public
 */
router.post('/register-first-admin', async (req, res) => {
  try {
    // Verificar si ya existe algún administrador
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    
    if (adminExists) {
      return res.status(403).json({ error: 'Ya existe un administrador en el sistema' });
    }
    
    const { username, password, email } = req.body;
    
    // Validar datos
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'El nombre de usuario o email ya está en uso' });
    }
    
    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Crear usuario con rol de administrador
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      role: 'admin'
    });
    
    // Crear token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Devolver respuesta sin incluir la contraseña
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    
    res.status(201).json({
      message: 'Administrador registrado correctamente',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Error al registrar primer administrador:', error);
    res.status(500).json({ error: 'Error al registrar administrador' });
  }
});

/**
 * @route POST /api/auth/register-admin
 * @desc Registrar un nuevo administrador
 * @access Public
 */
router.post('/register-admin', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // Validar datos
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'El nombre de usuario o email ya está en uso' });
    }
    
    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Crear usuario con rol de administrador
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      role: 'admin'
    });
    
    // Crear token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Devolver respuesta sin incluir la contraseña
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    
    res.status(201).json({
      message: 'Administrador registrado correctamente',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Error al registrar administrador:', error);
    res.status(500).json({ error: 'Error al registrar administrador' });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Iniciar sesión
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validar datos
    if (!username || !password) {
      return res.status(400).json({ error: 'Nombre de usuario y contraseña son obligatorios' });
    }
    
    // Buscar usuario
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Crear token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Devolver respuesta sin incluir la contraseña
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    
    res.json({
      message: 'Inicio de sesión exitoso',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

router.post('/create-admin', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validar datos
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Nombre de usuario, correo electrónico y contraseña son obligatorios' });
    }

    // Verificar si ya existe un usuario con ese nombre o email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10); 

    // Crear el primer usuario administrador
    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      role: 'admin' // Si tu modelo tiene un campo de rol, asegúrate de incluirlo.
    });

    res.status(201).json({ message: 'Administrador creado con éxito', user: { username: user.username, email: user.email } });

  } catch (error) {
    console.error('Error en /create-admin:', error);
    res.status(500).json({ error: 'Ocurrió un error al crear el administrador', details: error.message });
  }
});

/**
 * @route GET /api/auth/check-admin-exists
 * @desc Verificar si existe algún administrador en el sistema
 * @access Public
 */
router.get('/check-admin-exists', async (req, res) => {
  try {
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    res.json({ exists: !!adminExists });
  } catch (error) {
    console.error('Error al verificar administradores:', error);
    res.status(500).json({ error: 'Error al verificar administradores' });
  }
});

module.exports = router;

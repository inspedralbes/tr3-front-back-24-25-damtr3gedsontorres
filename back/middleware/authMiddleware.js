const jwt = require('jsonwebtoken');
const { User } = require('../database/sqlModels');

/**
 * Middleware para verificar el token JWT
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar con el siguiente middleware
 */
const verifyToken = (req, res, next) => {
  try {
    // Obtener el token del header
    const token = req.headers['x-access-token'] || req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
      return res.status(403).json({ error: 'No se proporcionó un token de autenticación' });
    }
    
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Guardar el ID del usuario en el objeto de solicitud
    req.userId = decoded.id;
    req.userRole = decoded.role;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(401).json({ error: 'Token inválido' });
  }
};

/**
 * Middleware para verificar si el usuario es administrador
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar con el siguiente middleware
 */
const isAdmin = async (req, res, next) => {
  try {
    // Verificar si el rol ya está en el objeto de solicitud
    if (req.userRole === 'admin') {
      return next();
    }
    
    // Si no está en el objeto de solicitud, consultar la base de datos
    const user = await User.findByPk(req.userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado: Se requieren permisos de administrador' });
    }
    
    next();
  } catch (error) {
    console.error('Error al verificar permisos de administrador:', error);
    res.status(500).json({ error: 'Error al verificar permisos' });
  }
};

module.exports = {
  verifyToken,
  isAdmin
};

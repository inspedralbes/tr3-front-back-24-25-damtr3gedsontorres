/**
 * Servicio para gestionar la autenticación de usuarios
 * Utiliza fetch para las peticiones HTTP
 */

import { fetchWithAuth } from './httpInterceptor';

// URL base para las llamadas a la API, utilizando variable de entorno o valor por defecto
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Clave para almacenar el token en localStorage
const TOKEN_KEY = 'auth_token';
// Clave para almacenar los datos del usuario en localStorage
const USER_KEY = 'user_data';

/**
 * Registra un nuevo administrador
 * @param {Object} userData - Datos del administrador (username, password, email)
 * @returns {Promise<Object>} Datos del administrador registrado
 */
export const registerAdmin = async (userData) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/auth/register-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en el registro');
    }
    
    const data = await response.json();
    
    // Guardar el token y los datos del usuario
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Error al registrar administrador:', error);
    throw error;
  }
};

/**
 * Inicia sesión con credenciales de administrador
 * @param {Object} credentials - Credenciales (username, password)
 * @returns {Promise<Object>} Datos del usuario y token
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en el inicio de sesión');
    }
    
    const data = await response.json();
    
    // Guardar token y datos del usuario en localStorage
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

/**
 * Cierra la sesión del usuario actual
 */
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  
  // Redirigir al login si estamos en el navegador
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

/**
 * Obtiene la información del usuario actual
 * @returns {Object|null} Datos del usuario o null si no hay usuario autenticado
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return null;
  }
};

/**
 * Verifica si hay un usuario autenticado
 * @returns {Boolean} True si hay un usuario autenticado
 */
export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    
    // Si no hay token o datos de usuario, no está autenticado
    if (!token || !userStr) {
      return false;
    }
    
    // Intentar parsear los datos del usuario
    let user;
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error('Error al parsear datos de usuario:', e);
      return false;
    }
    
    // Verificar que el usuario tenga los campos necesarios
    if (!user || !user.username) {
      return false;
    }
    console.log('Usuario aut', user);
    return true;
  } catch (error) {
    console.error('Error al verificar autenticación:', error);
    return false;
  }
};

/**
 * Verifica si el usuario actual es administrador
 * @returns {Boolean} True si el usuario es administrador
 */
export const isAdmin = () => {
  try {
    const user = getCurrentUser();
    return user && user.role === 'admin';
  } catch (error) {
    console.error('Error al verificar si es admin:', error);
    return false;
  }
};

/**
 * Obtiene el token de autenticación
 * @returns {String|null} Token de autenticación o null si no hay
 */
export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export default {
  registerAdmin,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  isAdmin,
  getAuthToken
};

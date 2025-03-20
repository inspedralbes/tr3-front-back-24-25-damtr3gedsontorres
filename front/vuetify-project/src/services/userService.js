/**
 * Servicio para gestionar las operaciones relacionadas con usuarios
 * Utiliza la misma sintaxis de fetch que el componente original
 */

// URL base para las peticiones
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Obtiene todos los usuarios
 * @returns {Promise<Array>} Lista de usuarios
 */
export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/`);
    if (!response.ok) {
      throw new Error(`Error de servidor: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

/**
 * Obtiene un usuario por su ID
 * @param {Number} id - ID del usuario
 * @returns {Promise<Object>} Datos del usuario
 */
export const fetchUserById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`Error de servidor: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener usuario con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Guarda un usuario (crea o actualiza)
 * @param {Object} userData - Datos del usuario
 * @param {Boolean} isEditing - Indica si es una edición o creación
 * @returns {Promise<Object>} Datos del usuario guardado
 */
export const saveUser = async (userData, isEditing) => {
  try {
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing 
      ? `${API_BASE_URL}/api/users/${userData.id}`
      : `${API_BASE_URL}/api/users/`;
      
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la respuesta del servidor');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    throw error;
  }
};

/**
 * Elimina un usuario
 * @param {Number} id - ID del usuario a eliminar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, { 
      method: 'DELETE' 
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la respuesta del servidor');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};

export default {
  fetchUsers,
  fetchUserById,
  saveUser,
  deleteUser
};

/**
 * Servicio para gestionar las operaciones relacionadas con enemigos
 * Utiliza la misma sintaxis de fetch que el componente original
 */

import { fetchWithAuth } from './httpInterceptor';

// URL base para las peticiones
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Obtiene todos los enemigos
 * @returns {Promise<Array>} Lista de enemigos
 */
export const fetchEnemies = async () => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/enemies/`);
    if (!response.ok) {
      throw new Error(`Error de servidor: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener enemigos:', error);
    throw error;
  }
};

/**
 * Guarda un enemigo (crea o actualiza)
 * @param {Object} enemyData - Datos del enemigo
 * @param {Boolean} isEditing - Indica si es una edición o creación
 * @returns {Promise<Object>} Datos del enemigo guardado
 */
export const saveEnemy = async (enemyData, isEditing) => {
  try {
    // Asegurarnos de que los campos numéricos son números
    const processedData = {
      ...enemyData,
      health: Number(enemyData.health),
      attack: Number(enemyData.attack),
      speed: Number(enemyData.speed),
      reward: Number(enemyData.reward)
    };
    
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing 
      ? `${API_BASE_URL}/api/enemies/${enemyData.id}`
      : `${API_BASE_URL}/api/enemies/`;
      
    const response = await fetchWithAuth(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(processedData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la respuesta del servidor');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al guardar enemigo:', error);
    throw error;
  }
};

/**
 * Elimina un enemigo
 * @param {Number} id - ID del enemigo a eliminar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteEnemy = async (id) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/enemies/${id}`, { 
      method: 'DELETE' 
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la respuesta del servidor');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al eliminar enemigo:', error);
    throw error;
  }
};

export default {
  fetchEnemies,
  saveEnemy,
  deleteEnemy
};

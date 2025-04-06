/**
 * Servicio para gestionar las operaciones relacionadas con los registros de partidas (Game)
 */

import { fetchWithAuth } from './httpInterceptor';

// URL base para las peticiones
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const GAMES_API_URL = `${API_BASE_URL}/api/mongo/games`;

/**
 * Obtiene todos los registros de partidas
 * @returns {Promise<Array>} Lista de partidas
 */
export const fetchGames = async () => {
  try {
    const response = await fetchWithAuth(`${GAMES_API_URL}/`);
    if (!response.ok) {
      throw new Error(`Error de servidor: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener registros de partidas:', error);
    throw error;
  }
};

/**
 * Obtiene partidas por email de usuario
 * @param {String} email - Email del usuario
 * @returns {Promise<Array>} Lista de partidas del usuario
 */
export const fetchGamesByEmail = async (email) => {
  try {
    const response = await fetchWithAuth(`${GAMES_API_URL}/user/${email}`);
    if (!response.ok) {
      throw new Error(`Error de servidor: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener partidas del usuario ${email}:`, error);
    throw error;
  }
};

/**
 * Obtiene un registro de partida por su ID
 * @param {String} id - ID de la partida
 * @returns {Promise<Object>} Datos de la partida
 */
export const fetchGameById = async (id) => {
  try {
    const response = await fetchWithAuth(`${GAMES_API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Error de servidor: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener el registro de partida ${id}:`, error);
    throw error;
  }
};

/**
 * Crea un nuevo registro de partida
 * @param {Object} gameData - Datos de la partida
 * @returns {Promise<Object>} Datos de la partida creada
 */
export const createGame = async (gameData) => {
  try {
    const response = await fetchWithAuth(`${GAMES_API_URL}/`, {
      method: 'POST',
      body: JSON.stringify(gameData)
    });
    if (!response.ok) {
      throw new Error(`Error de servidor: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al crear el registro de partida:', error);
    throw error;
  }
};

/**
 * Actualiza un registro de partida existente
 * @param {String} id - ID de la partida
 * @param {Object} gameData - Datos actualizados de la partida
 * @returns {Promise<Object>} Datos de la partida actualizada
 */
export const updateGame = async (id, gameData) => {
  try {
    const response = await fetchWithAuth(`${GAMES_API_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(gameData)
    });
    if (!response.ok) {
      throw new Error(`Error de servidor: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al actualizar el registro de partida ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina un registro de partida
 * @param {String} id - ID de la partida a eliminar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteGame = async (id) => {
  try {
    const response = await fetchWithAuth(`${GAMES_API_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(`Error de servidor: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al eliminar el registro de partida ${id}:`, error);
    throw error;
  }
};

/**
 * Genera estadísticas de juego utilizando Python para un usuario específico
 * @param {String} email - Email del usuario para generar estadísticas
 * @returns {Promise<Object>} Resultado de la operación y rutas de los gráficos generados
 */
export const generateGameStats = async (email) => {
  try {
    // Llamada real al endpoint que ejecuta el script de Python
    const response = await fetchWithAuth(`${API_BASE_URL}/api/stats/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al generar estadísticas');
    }
    
    const data = await response.json();
    
    // Si no tenemos rutas de gráficos en la respuesta, usamos rutas predeterminadas
    if (!data.graphPaths || Object.keys(data.graphPaths).length === 0) {
      data.graphPaths = {
        graf1: `${API_BASE_URL}/api/stats/${email.replace('@', '_at_')}/graf1_enemies_avg.png`,
        graf2: `${API_BASE_URL}/api/stats/${email.replace('@', '_at_')}/graf2_bullets_vs_enemies.png`,
        graf3: `${API_BASE_URL}/api/stats/${email.replace('@', '_at_')}/graf3_bullets_used.png`
      };
    }
    
    return {
      success: true,
      message: data.message || `Estadísticas generadas para ${email}`,
      graphPaths: {
        pie: data.graphPaths.graf1 || `${API_BASE_URL}/api/stats/${email.replace('@', '_at_')}/graf1_enemies_avg.png`,
        bar: data.graphPaths.graf2 || `${API_BASE_URL}/api/stats/${email.replace('@', '_at_')}/graf2_bullets_vs_enemies.png`,
        line: data.graphPaths.graf3 || `${API_BASE_URL}/api/stats/${email.replace('@', '_at_')}/graf3_bullets_used.png`
      },
      output: data.output
    };
    
  } catch (error) {
    console.error(`Error al generar estadísticas para ${email}:`, error);
    throw error;
  }
};

export default {
  fetchGames,
  fetchGamesByEmail,
  fetchGameById,
  createGame,
  updateGame,
  deleteGame,
  generateGameStats
};

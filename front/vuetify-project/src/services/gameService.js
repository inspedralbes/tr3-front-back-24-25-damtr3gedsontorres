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

export default {
  fetchGames,
  fetchGamesByEmail,
  fetchGameById,
  createGame,
  updateGame,
  deleteGame
};

/**
 * Servicio para gestionar las operaciones relacionadas con las oleadas (Waves)
 */

import { fetchWithAuth } from './httpInterceptor';

// URL base para las llamadas a la API, utilizando variable de entorno o valor por defecto
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Obtiene todas las oleadas
 * @returns {Promise<Array>} - Lista de oleadas
 */
const fetchWaves = async () => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/waves/`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: No se pudieron obtener las oleadas`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en fetchWaves:', error);
    throw error;
  }
};

/**
 * Obtiene oleadas filtradas por nivel
 * @param {number} level - Nivel de las oleadas a obtener
 * @returns {Promise<Array>} - Lista de oleadas del nivel especificado
 */
const fetchWavesByLevel = async (level) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/waves/level/${level}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: No se pudieron obtener las oleadas del nivel ${level}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en fetchWavesByLevel para nivel ${level}:`, error);
    throw error;
  }
};

/**
 * Obtiene una oleada específica por su ID
 * @param {number} id - ID de la oleada a obtener
 * @returns {Promise<Object>} - Datos de la oleada
 */
const fetchWaveById = async (id) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/waves/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: No se pudo obtener la oleada con ID ${id}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en fetchWaveById para ID ${id}:`, error);
    throw error;
  }
};

/**
 * Guarda una oleada (crea nueva o actualiza existente)
 * @param {Object} wave - Datos de la oleada a guardar
 * @param {boolean} isUpdate - Indica si es una actualización (true) o creación (false)
 * @returns {Promise<Object>} - Datos de la oleada guardada
 */
const saveWave = async (wave, isUpdate = false) => {
  try {
    const url = isUpdate 
      ? `${API_BASE_URL}/api/waves/${wave.id}`
      : `${API_BASE_URL}/api/waves/`;
    
    const method = isUpdate ? 'PUT' : 'POST';
    
    // Asegurarnos de que los campos numéricos son números
    const processedData = {
      ...wave,
      level: Number(wave.level),
      numEnemies: Number(wave.numEnemies),
      reward: Number(wave.reward)
    };
    
    const response = await fetchWithAuth(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(processedData)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: No se pudo ${isUpdate ? 'actualizar' : 'crear'} la oleada`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en saveWave:', error);
    throw error;
  }
};

/**
 * Elimina una oleada
 * @param {number} id - ID de la oleada a eliminar
 * @returns {Promise<void>}
 */
const deleteWave = async (id) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/waves/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: No se pudo eliminar la oleada con ID ${id}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en deleteWave para ID ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene estadísticas de oleadas
 * @returns {Promise<Object>} - Objeto con estadísticas
 */
const fetchWaveStats = async () => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/waves/stats`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: No se pudieron obtener las estadísticas de oleadas`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en fetchWaveStats:', error);
    throw error;
  }
};

// Exportar todas las funciones del servicio
export {
  fetchWaves,
  fetchWavesByLevel,
  fetchWaveById,
  saveWave,
  deleteWave,
  fetchWaveStats
};

/**
 * Servicio para gestionar las operaciones relacionadas con objetos
 * Utiliza la misma sintaxis de fetch que el componente original
 */

import { fetchWithAuth } from './httpInterceptor';

// URL base para las peticiones
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Obtiene todos los objetos
 * @returns {Promise<Array>} Lista de objetos
 */
export const fetchObjects = async () => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/objects/`);
    if (!response.ok) {
      throw new Error(`Error de servidor: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener objetos:', error);
    throw error;
  }
};

/**
 * Obtiene un objeto por su ID
 * @param {Number} id - ID del objeto
 * @returns {Promise<Object>} Datos del objeto
 */
export const fetchObjectById = async (id) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/objects/${id}`);
    if (!response.ok) {
      throw new Error(`Error de servidor: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener objeto con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Guarda un objeto (crea o actualiza)
 * @param {Object} objectData - Datos del objeto
 * @param {Boolean} isEditing - Indica si es una edición o creación
 * @returns {Promise<Object>} Datos del objeto guardado
 */
export const saveObject = async (objectData, isEditing) => {
  try {
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing 
      ? `${API_BASE_URL}/api/objects/${objectData.id}`
      : `${API_BASE_URL}/api/objects/`;
      
    const response = await fetchWithAuth(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objectData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la respuesta del servidor');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al guardar objeto:', error);
    throw error;
  }
};

/**
 * Elimina un objeto
 * @param {Number} id - ID del objeto a eliminar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteObject = async (id) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/objects/${id}`, { 
      method: 'DELETE' 
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la respuesta del servidor');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al eliminar objeto:', error);
    throw error;
  }
};

export default {
  fetchObjects,
  fetchObjectById,
  saveObject,
  deleteObject
};

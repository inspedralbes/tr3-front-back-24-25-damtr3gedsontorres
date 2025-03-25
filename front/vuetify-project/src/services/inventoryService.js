/**
 * Servicio para gestionar las operaciones relacionadas con inventario
 * Utiliza la misma sintaxis de fetch que el componente original
 */

import { fetchWithAuth } from './httpInterceptor';

// URL base para las peticiones
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Obtiene todos los elementos del inventario
 * @returns {Promise<Array>} Lista de elementos del inventario
 */
export const fetchInventoryItems = async () => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/inventory/`);
    if (!response.ok) {
      throw new Error(`Error de servidor: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener elementos del inventario:', error);
    throw error;
  }
};

/**
 * Obtiene los elementos del inventario de un usuario específico
 * @param {Number} userId - ID del usuario
 * @returns {Promise<Array>} Lista de elementos del inventario del usuario
 */
export const fetchInventoryByUser = async (userId) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/inventory/user/${userId}`);
    if (!response.ok) {
      throw new Error(`Error de servidor: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener inventario del usuario ${userId}:`, error);
    throw error;
  }
};

/**
 * Obtiene un elemento del inventario por su ID
 * @param {Number} id - ID del elemento
 * @returns {Promise<Object>} Datos del elemento
 */
export const fetchInventoryItemById = async (id) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/inventory/${id}`);
    if (!response.ok) {
      throw new Error(`Error de servidor: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener elemento de inventario con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Guarda un elemento del inventario (crea o actualiza)
 * @param {Object} itemData - Datos del elemento
 * @param {Boolean} isEditing - Indica si es una edición o creación
 * @returns {Promise<Object>} Datos del elemento guardado
 */
export const saveInventoryItem = async (itemData, isEditing) => {
  try {
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing 
      ? `${API_BASE_URL}/api/inventory/${itemData.id}`
      : `${API_BASE_URL}/api/inventory/`;
      
    const response = await fetchWithAuth(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la respuesta del servidor');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al guardar elemento de inventario:', error);
    throw error;
  }
};

/**
 * Elimina un elemento del inventario
 * @param {Number} id - ID del elemento a eliminar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteInventoryItem = async (id) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/inventory/${id}`, { 
      method: 'DELETE' 
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la respuesta del servidor');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al eliminar elemento de inventario:', error);
    throw error;
  }
};

export default {
  fetchInventoryItems,
  fetchInventoryByUser,
  fetchInventoryItemById,
  saveInventoryItem,
  deleteInventoryItem
};

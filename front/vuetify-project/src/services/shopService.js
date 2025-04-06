/**
 * Servicio para gestionar las operaciones relacionadas con la tienda (Shop)
 */

import { fetchWithAuth } from './httpInterceptor';

// URL base para las llamadas a la API, utilizando variable de entorno o valor por defecto
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Obtiene todos los items de la tienda
 * @returns {Promise<Array>} - Lista de items de la tienda
 */
const fetchShopItems = async () => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/shop/`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: No se pudieron obtener los items de la tienda`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en fetchShopItems:', error);
    throw error;
  }
};

/**
 * Obtiene solo los items disponibles de la tienda
 * @returns {Promise<Array>} - Lista de items disponibles
 */
const fetchAvailableShopItems = async () => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/shop/available`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: No se pudieron obtener los items disponibles`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en fetchAvailableShopItems:', error);
    throw error;
  }
};

/**
 * Obtiene un item específico de la tienda por su ID
 * @param {number} id - ID del item a obtener
 * @returns {Promise<Object>} - Datos del item
 */
const fetchShopItemById = async (id) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/shop/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: No se pudo obtener el item con ID ${id}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en fetchShopItemById para ID ${id}:`, error);
    throw error;
  }
};

/**
 * Guarda un item de la tienda (crea nuevo o actualiza existente)
 * @param {Object} shopItem - Datos del item a guardar
 * @param {boolean} isUpdate - Indica si es una actualización (true) o creación (false)
 * @returns {Promise<Object>} - Datos del item guardado
 */
const saveShopItem = async (shopItem, isUpdate = false) => {
  try {
    const url = isUpdate 
      ? `${API_BASE_URL}/api/shop/${shopItem.id}`
      : `${API_BASE_URL}/api/shop/`;
    
    const method = isUpdate ? 'PUT' : 'POST';
    
    const response = await fetchWithAuth(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(shopItem)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: No se pudo guardar el item de la tienda`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en saveShopItem:', error);
    throw error;
  }
};

/**
 * Elimina un item de la tienda
 * @param {number} id - ID del item a eliminar
 * @returns {Promise<void>}
 */
const deleteShopItem = async (id) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/shop/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: No se pudo eliminar el item con ID ${id}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en deleteShopItem para ID ${id}:`, error);
    throw error;
  }
};

/**
 * Actualiza la disponibilidad de un item de la tienda
 * @param {number} id - ID del item
 * @param {boolean} available - Estado de disponibilidad
 * @returns {Promise<Object>} - Datos del item actualizado
 */
const updateShopItemAvailability = async (id, available) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/shop/${id}/availability`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ available })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: No se pudo actualizar la disponibilidad del item`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en updateShopItemAvailability para ID ${id}:`, error);
    throw error;
  }
};

// Exportar todas las funciones del servicio
export {
  fetchShopItems,
  fetchAvailableShopItems,
  fetchShopItemById,
  saveShopItem,
  deleteShopItem,
  updateShopItemAvailability
};

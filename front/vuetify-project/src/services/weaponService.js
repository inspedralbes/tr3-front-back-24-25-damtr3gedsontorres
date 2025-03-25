/**
 * Servicio para gestionar las operaciones relacionadas con armas
 * Utiliza la misma sintaxis de fetch que el componente original
 */

import { fetchWithAuth } from './httpInterceptor';

// URL base para las peticiones
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Obtiene todas las armas
 * @returns {Promise<Array>} Lista de armas
 */
export const fetchWeapons = async () => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/weapons/`);
    if (!response.ok) {
      throw new Error(`Error de servidor: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener armas:', error);
    throw error;
  }
};

/**
 * Obtiene un arma por su ID
 * @param {Number} id - ID del arma
 * @returns {Promise<Object>} Datos del arma
 */
export const fetchWeaponById = async (id) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/weapons/${id}`);
    if (!response.ok) {
      throw new Error(`Error de servidor: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener arma con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Guarda un arma (crea o actualiza)
 * @param {Object} weaponData - Datos del arma
 * @param {Boolean} isEditing - Indica si es una edición o creación
 * @returns {Promise<Object>} Datos del arma guardada
 */
export const saveWeapon = async (weaponData, isEditing = false) => {
  try {
    const url = isEditing
      ? `${API_BASE_URL}/api/weapons/${weaponData.id}`
      : `${API_BASE_URL}/api/weapons/`;
    
    const method = isEditing ? 'PUT' : 'POST';
    
    // Asegurarse de que los valores numéricos sean números
    const processedData = {
      ...weaponData,
      damage: Number(weaponData.damage),
      price: Number(weaponData.price)
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
      throw new Error(errorData?.message || `Error ${response.status}: No se pudo guardar el arma`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al guardar arma:', error);
    throw error;
  }
};

/**
 * Elimina un arma
 * @param {Number} id - ID del arma a eliminar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteWeapon = async (id) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/weapons/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: No se pudo eliminar el arma con ID ${id}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error al eliminar arma con ID ${id}:`, error);
    throw error;
  }
};

export default {
  fetchWeapons,
  fetchWeaponById,
  saveWeapon,
  deleteWeapon
};

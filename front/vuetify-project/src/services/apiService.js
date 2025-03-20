/**
 * Servicio centralizado para gestionar las peticiones a la API
 * Utiliza la variable de entorno VITE_API_URL para determinar la URL base
 */

// Determinar la URL base según el entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Maneja la respuesta de una petición a la API
 * @param {Response} response - Respuesta de la petición fetch
 * @returns {Promise<any>} - Datos de la respuesta o error
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Servicio para realizar peticiones a la API
 */
const apiService = {
  /**
   * Realiza una petición GET a la API
   * @param {string} endpoint - Endpoint de la API
   * @returns {Promise<any>} - Datos de la respuesta
   */
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      return handleResponse(response);
    } catch (error) {
      console.error(`Error en GET ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Realiza una petición POST a la API
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} data - Datos a enviar
   * @returns {Promise<any>} - Datos de la respuesta
   */
  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error en POST ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Realiza una petición PUT a la API
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} data - Datos a enviar
   * @returns {Promise<any>} - Datos de la respuesta
   */
  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error en PUT ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Realiza una petición DELETE a la API
   * @param {string} endpoint - Endpoint de la API
   * @returns {Promise<any>} - Datos de la respuesta
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error en DELETE ${endpoint}:`, error);
      throw error;
    }
  },
};

export default apiService;

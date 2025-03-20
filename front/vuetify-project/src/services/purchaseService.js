/**
 * Servicio para gestionar las operaciones relacionadas con las compras (Purchases)
 */

// URL base para las llamadas a la API, utilizando variable de entorno o valor por defecto
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Obtiene todas las compras
 * @returns {Promise<Array>} - Lista de compras
 */
const fetchPurchases = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/purchases/`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: No se pudieron obtener las compras`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en fetchPurchases:', error);
    throw error;
  }
};

/**
 * Obtiene las compras de un usuario específico
 * @param {number} userId - ID del usuario
 * @returns {Promise<Array>} - Lista de compras del usuario
 */
const fetchPurchasesByUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/purchases/user/${userId}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: No se pudieron obtener las compras del usuario #${userId}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en fetchPurchasesByUser(${userId}):`, error);
    throw error;
  }
};

/**
 * Obtiene una compra específica por su ID
 * @param {number} id - ID de la compra a obtener
 * @returns {Promise<Object>} - Datos de la compra
 */
const fetchPurchaseById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/purchases/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: No se pudo obtener la compra #${id}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en fetchPurchaseById(${id}):`, error);
    throw error;
  }
};

/**
 * Guarda una compra (crea nueva o actualiza existente)
 * @param {Object} purchase - Datos de la compra a guardar
 * @param {boolean} isUpdate - Indica si es una actualización (true) o creación (false)
 * @returns {Promise<Object>} - Datos de la compra guardada
 */
const savePurchase = async (purchase, isUpdate = false) => {
  try {
    const url = isUpdate 
      ? `${API_BASE_URL}/api/purchases/${purchase.id}` 
      : `${API_BASE_URL}/api/purchases/`;
    
    const method = isUpdate ? 'PUT' : 'POST';
    
    // Asegurarnos de que los campos numéricos son números
    const processedData = {
      ...purchase,
      price: Number(purchase.price),
      userId: Number(purchase.userId),
      shopId: Number(purchase.shopId)
    };
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(processedData)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: No se pudo ${isUpdate ? 'actualizar' : 'crear'} la compra`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en savePurchase (${isUpdate ? 'update' : 'create'}):`, error);
    throw error;
  }
};

/**
 * Elimina una compra
 * @param {number} id - ID de la compra a eliminar
 * @returns {Promise<void>}
 */
const deletePurchase = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/purchases/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: No se pudo eliminar la compra #${id}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en deletePurchase(${id}):`, error);
    throw error;
  }
};

/**
 * Obtiene estadísticas de compras
 * @returns {Promise<Object>} - Objeto con estadísticas
 */
const fetchPurchaseStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/purchases/stats`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: No se pudieron obtener las estadísticas de compras`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en fetchPurchaseStats:', error);
    throw error;
  }
};

// Exportar todas las funciones del servicio
export {
  fetchPurchases,
  fetchPurchasesByUser,
  fetchPurchaseById,
  savePurchase,
  deletePurchase,
  fetchPurchaseStats
};

import apiService from './apiService';

// Función para manejar respuestas y errores
const handleResponse = async (promise) => {
  try {
    return await promise;
  } catch (error) {
    console.error("Error en la comunicación con la API:", error);
    throw error;
  }
};

export default {
  // Enemigos
  async createEnemy(enemyData) {
    return handleResponse(apiService.post('/api/enemies', enemyData));
  },

  async getEnemies() {
    return handleResponse(apiService.get('/api/enemies'));
  },

  async getEnemyById(id) {
    return handleResponse(apiService.get(`/api/enemies/${id}`));
  },

  async updateEnemy(id, enemyData) {
    return handleResponse(apiService.put(`/api/enemies/${id}`, enemyData));
  },

  async deleteEnemy(id) {
    return handleResponse(apiService.delete(`/api/enemies/${id}`));
  },

  // Armas
  async createWeapon(weaponData) {
    return handleResponse(apiService.post('/api/weapons', weaponData));
  },

  async getWeapons() {
    return handleResponse(apiService.get('/api/weapons'));
  },

  async getWeaponById(id) {
    return handleResponse(apiService.get(`/api/weapons/${id}`));
  },

  async updateWeapon(id, weaponData) {
    return handleResponse(apiService.put(`/api/weapons/${id}`, weaponData));
  },

  async deleteWeapon(id) {
    return handleResponse(apiService.delete(`/api/weapons/${id}`));
  },

  // Oleadas
  async createWave(waveData) {
    return handleResponse(apiService.post('/api/waves', waveData));
  },

  async getWaves() {
    return handleResponse(apiService.get('/api/waves'));
  },

  async getWaveById(id) {
    return handleResponse(apiService.get(`/api/waves/${id}`));
  },

  async updateWave(id, waveData) {
    return handleResponse(apiService.put(`/api/waves/${id}`, waveData));
  },

  async deleteWave(id) {
    return handleResponse(apiService.delete(`/api/waves/${id}`));
  },

  // Inventario
  async createInventoryItem(itemData) {
    return handleResponse(apiService.post('/api/inventory', itemData));
  },

  async getInventoryItems() {
    return handleResponse(apiService.get('/api/inventory'));
  },

  async getInventoryByUser(userId) {
    return handleResponse(apiService.get(`/api/inventory/user/${userId}`));
  },

  async getInventoryItemById(id) {
    return handleResponse(apiService.get(`/api/inventory/${id}`));
  },

  async updateInventoryItem(id, itemData) {
    return handleResponse(apiService.put(`/api/inventory/${id}`, itemData));
  },

  async deleteInventoryItem(id) {
    return handleResponse(apiService.delete(`/api/inventory/${id}`));
  },

  // Compras
  async createPurchase(purchaseData) {
    return handleResponse(apiService.post('/api/purchases', purchaseData));
  },

  async getPurchases() {
    return handleResponse(apiService.get('/api/purchases'));
  },

  async getPurchasesByUser(userId) {
    return handleResponse(apiService.get(`/api/purchases/user/${userId}`));
  },

  async getPurchaseById(id) {
    return handleResponse(apiService.get(`/api/purchases/${id}`));
  },

  async updatePurchase(id, purchaseData) {
    return handleResponse(apiService.put(`/api/purchases/${id}`, purchaseData));
  },

  async deletePurchase(id) {
    return handleResponse(apiService.delete(`/api/purchases/${id}`));
  },

  // Tienda
  async createShopItem(shopData) {
    return handleResponse(apiService.post('/api/shop', shopData));
  },

  async getShopItems() {
    return handleResponse(apiService.get('/api/shop'));
  },

  async getAvailableShopItems() {
    return handleResponse(apiService.get('/api/shop/available'));
  },

  async getShopItemById(id) {
    return handleResponse(apiService.get(`/api/shop/${id}`));
  },

  async updateShopItem(id, shopData) {
    return handleResponse(apiService.put(`/api/shop/${id}`, shopData));
  },

  async deleteShopItem(id) {
    return handleResponse(apiService.delete(`/api/shop/${id}`));
  },
};

<template>
  <v-container fluid class="pa-4">
    <v-card elevation="4" class="rounded-xl overflow-hidden border">
      <!-- Header con fondo degradado -->
      <v-toolbar flat class="purchase-toolbar px-4" dark>
        <v-toolbar-title class="d-flex align-center">
          <v-icon size="28" class="mr-3">mdi-cart</v-icon>
          <span class="text-h5 font-weight-bold">Gestión de Compras</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar compra"
          single-line
          hide-details
          filled
          rounded
          dense
          class="mx-2 search-field"
          bg-color="rgba(255, 255, 255, 0.15)"
        ></v-text-field>
        <v-btn 
          color="secondary" 
          elevation="2" 
          @click="openDialog()" 
          rounded 
          class="ml-2"
        >
          <v-icon left>mdi-plus</v-icon>
          <span class="d-none d-sm-inline">Añadir Compra</span>
        </v-btn>
      </v-toolbar>

      <!-- Tarjetas de estadísticas resumen -->
      <v-row class="mx-2 my-4">
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="2" class="rounded-lg stat-card">
            <v-card-text class="d-flex align-center py-4">
              <v-avatar color="primary" size="46" class="mr-4">
                <v-icon dark>mdi-cart-outline</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Total Compras</div>
                <div class="text-h5 font-weight-bold">{{ purchases.length }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="2" class="rounded-lg stat-card">
            <v-card-text class="d-flex align-center py-4">
              <v-avatar color="amber darken-2" size="46" class="mr-4">
                <v-icon dark>mdi-currency-usd</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Gasto Total</div>
                <div class="text-h5 font-weight-bold">{{ totalSpent }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="2" class="rounded-lg stat-card">
            <v-card-text class="d-flex align-center py-4">
              <v-avatar color="success" size="46" class="mr-4">
                <v-icon dark>mdi-account-group</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Usuarios Compradores</div>
                <div class="text-h5 font-weight-bold">{{ uniqueUsers }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filtro de usuario -->
      <v-card-text class="px-4 pt-0 pb-2">
        <v-select
          v-model="userFilter"
          :items="userOptions"
          label="Filtrar por usuario"
          outlined
          dense
          prepend-inner-icon="mdi-filter"
          @change="filterByUser"
          class="max-width-select"
          clearable
          return-object
        ></v-select>
      </v-card-text>

      <!-- Tabla de datos mejorada -->
      <v-card-text class="px-4 py-0">
        <v-data-table
          :headers="headers"
          :items="filteredPurchases"
          :loading="loading"
          :items-per-page="10"
          :footer-props="{
            'items-per-page-options': [5, 10, 25, 50, -1],
            'items-per-page-text': 'Compras por página'
          }"
          class="elevation-1 rounded-lg"
        >
          <template v-slot:item.id="{ item }">
            <div class="font-weight-medium text-subtitle-2">#{{ item.id }}</div>
          </template>

          <template v-slot:item.userId="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="32" color="blue-grey lighten-4" class="mr-2">
                <v-icon color="blue-grey darken-2">mdi-account</v-icon>
              </v-avatar>
              <div class="font-weight-medium">{{ getUserName(item.userId) }}</div>
            </div>
          </template>

          <template v-slot:item.shopId="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="32" color="indigo lighten-4" class="mr-2">
                <v-icon color="indigo darken-2">mdi-shopping</v-icon>
              </v-avatar>
              <div class="font-weight-medium">{{ getShopItemName(item.shopId) }}</div>
            </div>
          </template>

          <template v-slot:item.price="{ item }">
            <div class="d-flex align-center">
              <v-icon color="amber darken-2" small class="mr-2">mdi-currency-usd</v-icon>
              <span>{{ item.price }}</span>
            </div>
          </template>
          
          <template v-slot:item.purchaseDate="{ item }">
            <div class="d-flex align-center">
              <v-icon color="grey darken-1" small class="mr-2">mdi-calendar</v-icon>
              <span>{{ formatDate(item.purchaseDate) }}</span>
            </div>
          </template>
          
          <template v-slot:item.actions="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn 
                  icon 
                  color="primary" 
                  v-bind="attrs"
                  v-on="on"
                  @click="openDialog(item)"
                >
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Editar</span>
            </v-tooltip>
            
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn 
                  icon 
                  color="error" 
                  v-bind="attrs"
                  v-on="on"
                  @click="confirmDelete(item)"
                >
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Eliminar</span>
            </v-tooltip>
          </template>
          
          <template v-slot:loading>
            <v-skeleton-loader
              v-for="i in 5"
              :key="i"
              type="table-row"
              class="my-2"
            ></v-skeleton-loader>
          </template>
          
          <template v-slot:no-data>
            <div class="text-center py-6">
              <v-icon x-large color="grey lighten-1" class="mb-4">mdi-cart-off</v-icon>
              <div class="text-h6 grey--text">No hay compras registradas</div>
              <v-btn color="primary" class="mt-4" @click="loadPurchases">
                Reintentar
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Diálogo para añadir/editar compra -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card class="pa-2">
        <v-card-title class="text-h5 primary--text">
          {{ editing ? 'Editar Compra' : 'Añadir Compra' }}
        </v-card-title>
        
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="purchase.userId"
                    :items="userOptions"
                    label="Usuario"
                    :rules="userRules"
                    required
                    outlined
                    dense
                    prepend-inner-icon="mdi-account"
                    item-text="text"
                    item-value="value"
                  ></v-select>
                </v-col>
                
                <v-col cols="12">
                  <v-select
                    v-model="purchase.shopId"
                    :items="shopOptions"
                    label="Item de Tienda"
                    :rules="shopRules"
                    required
                    outlined
                    dense
                    prepend-inner-icon="mdi-shopping"
                    item-text="text"
                    item-value="value"
                  ></v-select>
                </v-col>
                
                <v-col cols="12">
                  <v-text-field
                    v-model.number="purchase.price"
                    label="Precio"
                    :rules="priceRules"
                    required
                    outlined
                    dense
                    type="number"
                    min="0"
                    prepend-inner-icon="mdi-currency-usd"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12">
                  <v-menu
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="formattedDate"
                        label="Fecha de compra"
                        prepend-inner-icon="mdi-calendar"
                        readonly
                        outlined
                        dense
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="purchase.purchaseDate"
                      @input="dateMenu = false"
                      no-title
                      scrollable
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="grey darken-1" 
            text 
            @click="dialog = false"
            :disabled="loading"
          >
            Cancelar
          </v-btn>
          <v-btn 
            color="primary" 
            :loading="loading"
            :disabled="!valid"
            @click="savePurchase"
          >
            {{ editing ? 'Actualizar' : 'Guardar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación para eliminar -->
    <v-dialog v-model="dialogDelete" max-width="400px">
      <v-card>
        <v-card-title class="text-h5 error--text">
          ¿Eliminar compra?
        </v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar esta compra? Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="grey darken-1" 
            text 
            @click="dialogDelete = false"
            :disabled="loading"
          >
            Cancelar
          </v-btn>
          <v-btn 
            color="error" 
            :loading="loading"
            @click="deletePurchase(itemToDelete.id)"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para notificaciones -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
      bottom
      right
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">
          {{ snackbar.color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}
        </v-icon>
        {{ snackbar.text }}
      </div>
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar.show = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { fetchPurchases, fetchPurchasesByUser, savePurchase as savePurchaseService, deletePurchase as deletePurchaseService } from '@/services/purchaseService';
import { fetchUsers } from '@/services/userService';
import { fetchShopItems } from '@/services/shopService';

// Estado reactivo
const search = ref('');
const dialog = ref(false);
const dialogDelete = ref(false);
const loading = ref(false);
const valid = ref(false);
const editing = ref(false);
const dateMenu = ref(false);
const userFilter = ref(null);
const purchases = ref([]);
const users = ref([]);
const shopItems = ref([]);
const purchase = ref({ 
  id: null, 
  userId: null, 
  shopId: null, 
  price: 0, 
  purchaseDate: new Date().toISOString().substr(0, 10)
});
const itemToDelete = ref(null);
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
});

// Referencias
const form = ref(null);

// Datos de la tabla
const headers = [
  { text: 'ID', value: 'id', width: '5%' },
  { text: 'Usuario', value: 'userId', width: '25%' },
  { text: 'Item', value: 'shopId', width: '25%' },
  { text: 'Precio', value: 'price', align: 'center', width: '15%' },
  { text: 'Fecha', value: 'purchaseDate', align: 'center', width: '20%' },
  { text: 'Acciones', value: 'actions', sortable: false, align: 'center', width: '10%' }
];

// Reglas de validación
const userRules = [
  v => !!v || 'El usuario es obligatorio'
];

const shopRules = [
  v => !!v || 'El item de tienda es obligatorio'
];

const priceRules = [
  v => !!v || 'El precio es obligatorio',
  v => v >= 0 || 'El precio debe ser mayor o igual a 0'
];

// Propiedades computadas
const filteredPurchases = computed(() => {
  if (!search.value) return purchases.value;
  
  const searchTerm = search.value.toLowerCase();
  
  return purchases.value.filter(item => {
    const userName = getUserName(item.userId).toLowerCase();
    const shopItemName = getShopItemName(item.shopId).toLowerCase();
    
    return userName.includes(searchTerm) || 
           shopItemName.includes(searchTerm) || 
           String(item.price).includes(searchTerm) ||
           formatDate(item.purchaseDate).includes(searchTerm);
  });
});

const userOptions = computed(() => {
  return users.value.map(user => ({
    text: `${user.username} (${user.email})`,
    value: user.id
  }));
});

const shopOptions = computed(() => {
  return shopItems.value.map(item => {
    const weaponName = getWeaponNameByShopItem(item);
    return {
      text: `${weaponName} - $${item.price}`,
      value: item.id
    };
  });
});

const totalSpent = computed(() => {
  return purchases.value.reduce((sum, item) => sum + Number(item.price), 0);
});

const uniqueUsers = computed(() => {
  const uniqueUserIds = new Set(purchases.value.map(item => item.userId));
  return uniqueUserIds.size;
});

const formattedDate = computed(() => {
  if (!purchase.value.purchaseDate) return '';
  return formatDate(purchase.value.purchaseDate);
});

// Métodos
const showNotification = (text, color = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color
  };
};

const getUserName = (userId) => {
  const user = users.value.find(u => u.id === userId);
  return user ? user.username : `Usuario #${userId}`;
};

const getShopItemName = (shopId) => {
  const shopItem = shopItems.value.find(s => s.id === shopId);
  if (!shopItem) return `Item #${shopId}`;
  
  return getWeaponNameByShopItem(shopItem);
};

const getWeaponNameByShopItem = (shopItem) => {
  // Esta función simula obtener el nombre del arma asociada al item de tienda
  // En un caso real, podríamos tener una referencia directa o hacer una llamada adicional
  return `Arma #${shopItem.weaponId}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const loadPurchases = async () => {
  loading.value = true;
  try {
    purchases.value = await fetchPurchases();
  } catch (error) {
    console.error('Error al obtener compras:', error);
    showNotification('Error al cargar las compras', 'error');
  } finally {
    loading.value = false;
  }
};

const loadUsers = async () => {
  try {
    users.value = await fetchUsers();
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    showNotification('Error al cargar los usuarios', 'error');
  }
};

const loadShopItems = async () => {
  try {
    shopItems.value = await fetchShopItems();
  } catch (error) {
    console.error('Error al obtener items de tienda:', error);
    showNotification('Error al cargar los items de tienda', 'error');
  }
};

const filterByUser = async () => {
  loading.value = true;
  try {
    if (userFilter.value) {
      purchases.value = await fetchPurchasesByUser(userFilter.value.value);
    } else {
      await loadPurchases();
    }
  } catch (error) {
    console.error('Error al filtrar compras por usuario:', error);
    showNotification('Error al filtrar las compras', 'error');
  } finally {
    loading.value = false;
  }
};

const openDialog = (itemData = null) => {
  editing.value = !!itemData;
  purchase.value = itemData 
    ? { ...itemData } 
    : { 
        id: null, 
        userId: null, 
        shopId: null, 
        price: 0, 
        purchaseDate: new Date().toISOString().substr(0, 10)
      };
  dialog.value = true;
  
  // Resetear validación en el siguiente ciclo DOM
  nextTick(() => {
    if (form.value) {
      form.value.resetValidation();
    }
  });
};

const confirmDelete = (itemData) => {
  itemToDelete.value = itemData;
  dialogDelete.value = true;
};

const savePurchase = async () => {
  if (!form.value.validate()) return;
  
  loading.value = true;
  try {
    await savePurchaseService(purchase.value, editing.value);
    dialog.value = false;
    await loadPurchases();
    showNotification(`Compra ${editing.value ? 'actualizada' : 'añadida'} correctamente`);
  } catch (error) {
    console.error('Error al guardar compra:', error);
    showNotification(`Error al ${editing.value ? 'actualizar' : 'añadir'} la compra: ${error.message}`, 'error');
  } finally {
    loading.value = false;
  }
};

const deletePurchase = async (id) => {
  loading.value = true;
  try {
    await deletePurchaseService(id);
    dialogDelete.value = false;
    await loadPurchases();
    showNotification('Compra eliminada correctamente');
  } catch (error) {
    console.error('Error al eliminar compra:', error);
    showNotification(`Error al eliminar la compra: ${error.message}`, 'error');
  } finally {
    loading.value = false;
  }
};

// Ciclo de vida
onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      loadPurchases(),
      loadUsers(),
      loadShopItems()
    ]);
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.purchase-toolbar {
  background: linear-gradient(to right, #26a69a, #4db6ac);
}

.search-field, .max-width-select {
  max-width: 300px;
}

.stat-card {
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}
</style>
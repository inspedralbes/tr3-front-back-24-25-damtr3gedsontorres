<template>
  <v-container fluid class="pa-4">
    <v-card elevation="4" class="rounded-xl overflow-hidden border">
      <!-- Header con fondo degradado -->
      <v-toolbar flat class="shop-toolbar px-4" dark>
        <v-toolbar-title class="d-flex align-center">
          <v-icon size="28" class="mr-3">mdi-store</v-icon>
          <span class="text-h5 font-weight-bold">Gestión de Tienda</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar item"
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
          <span class="d-none d-sm-inline">Añadir Item</span>
        </v-btn>
      </v-toolbar>

      <!-- Tarjetas de estadísticas resumen -->
      <v-row class="mx-2 my-4">
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="2" class="rounded-lg stat-card">
            <v-card-text class="d-flex align-center py-4">
              <v-avatar color="primary" size="46" class="mr-4">
                <v-icon dark>mdi-shopping</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Total Items</div>
                <div class="text-h5 font-weight-bold">{{ shopItems.length }}</div>
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
                <div class="text-caption text-medium-emphasis">Precio Promedio</div>
                <div class="text-h5 font-weight-bold">{{ averagePrice }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="2" class="rounded-lg stat-card">
            <v-card-text class="d-flex align-center py-4">
              <v-avatar color="success" size="46" class="mr-4">
                <v-icon dark>mdi-check-circle</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Items Disponibles</div>
                <div class="text-h5 font-weight-bold">{{ availableItems }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filtro de disponibilidad -->
      <v-card-text class="px-4 pt-0 pb-2">
        <v-select
          v-model="availabilityFilter"
          :items="availabilityOptions"
          label="Filtrar por disponibilidad"
          outlined
          dense
          prepend-inner-icon="mdi-filter"
          @change="filterByAvailability"
          class="max-width-select"
        ></v-select>
      </v-card-text>

      <!-- Tabla de datos mejorada -->
      <v-card-text class="px-4 py-0">
        <v-data-table
          :headers="headers"
          :items="filteredShopItems"
          :loading="loading"
          :items-per-page="10"
          :footer-props="{
            'items-per-page-options': [5, 10, 25, 50, -1],
            'items-per-page-text': 'Items por página'
          }"
          class="elevation-1 rounded-lg"
        >
          <template v-slot:item.id="{ item }">
            <div class="font-weight-medium text-subtitle-2">#{{ item.id }}</div>
          </template>

          <template v-slot:item.weaponId="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="32" color="blue-grey lighten-4" class="mr-2">
                <v-icon color="blue-grey darken-2">mdi-sword</v-icon>
              </v-avatar>
              <div class="font-weight-medium">{{ getWeaponName(item.weaponId) }}</div>
            </div>
          </template>

          <template v-slot:item.price="{ item }">
            <div class="d-flex align-center">
              <v-icon color="amber darken-2" small class="mr-2">mdi-currency-usd</v-icon>
              <span>{{ item.price }}</span>
            </div>
          </template>
          
          <template v-slot:item.available="{ item }">
            <v-chip 
              :color="item.available ? 'success' : 'grey'" 
              text-color="white" 
              small
              class="px-2"
            >
              {{ item.available ? 'Disponible' : 'No disponible' }}
            </v-chip>
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
              <v-icon x-large color="grey lighten-1" class="mb-4">mdi-store-off</v-icon>
              <div class="text-h6 grey--text">No hay items en la tienda</div>
              <v-btn color="primary" class="mt-4" @click="loadShopItems">
                Reintentar
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Diálogo para añadir/editar item -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card class="pa-2">
        <v-card-title class="text-h5 primary--text">
          {{ editing ? 'Editar Item' : 'Añadir Item' }}
        </v-card-title>
        
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="shopItem.weaponId"
                    :items="weaponOptions"
                    label="Arma"
                    :rules="weaponRules"
                    required
                    outlined
                    dense
                    prepend-inner-icon="mdi-sword"
                  ></v-select>
                </v-col>
                
                <v-col cols="12">
                  <v-text-field
                    v-model.number="shopItem.price"
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
                  <v-switch
                    v-model="shopItem.available"
                    label="Disponible para compra"
                    color="success"
                    hide-details
                    class="mt-4"
                  ></v-switch>
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
            @click="saveShopItem"
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
          ¿Eliminar item de la tienda?
        </v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar este item de la tienda? Esta acción no se puede deshacer.
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
            @click="deleteShopItem(itemToDelete.id)"
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
import { ref, computed, onMounted, nextTick } from 'vue';
import { fetchShopItems, fetchAvailableShopItems, saveShopItem as saveShopItemService, deleteShopItem as deleteShopItemService } from '@/services/shopService';
import { fetchWeapons } from '@/services/weaponService';

// Estado reactivo
const search = ref('');
const dialog = ref(false);
const dialogDelete = ref(false);
const loading = ref(false);
const valid = ref(false);
const editing = ref(false);
const availabilityFilter = ref('all');
const shopItems = ref([]);
const weapons = ref([]);
const shopItem = ref({ 
  id: null, 
  weaponId: null, 
  price: 0, 
  available: true 
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
  { text: 'Arma', value: 'weaponId', width: '45%' },
  { text: 'Precio', value: 'price', align: 'center', width: '20%' },
  { text: 'Disponibilidad', value: 'available', align: 'center', width: '20%' },
  { text: 'Acciones', value: 'actions', sortable: false, align: 'center', width: '10%' }
];

// Opciones para el filtro de disponibilidad
const availabilityOptions = [
  { text: 'Todos los items', value: 'all' },
  { text: 'Disponibles', value: 'available' },
  { text: 'No disponibles', value: 'unavailable' }
];

// Reglas de validación
const weaponRules = [
  v => !!v || 'El arma es obligatoria'
];

const priceRules = [
  v => !!v || 'El precio es obligatorio',
  v => v >= 0 || 'El precio debe ser mayor o igual a 0'
];

// Propiedades computadas
const filteredShopItems = computed(() => {
  if (!search.value) return shopItems.value;
  
  return shopItems.value.filter(item => {
    const weaponName = getWeaponName(item.weaponId).toLowerCase();
    const searchTerm = search.value.toLowerCase();
    
    return weaponName.includes(searchTerm);
  });
});

const weaponOptions = computed(() => {
  return weapons.value.map(weapon => ({
    text: weapon.name,
    value: weapon.id
  }));
});

const averagePrice = computed(() => {
  if (shopItems.value.length === 0) return 0;
  const total = shopItems.value.reduce((sum, item) => sum + Number(item.price), 0);
  return Math.round(total / shopItems.value.length);
});

const availableItems = computed(() => {
  return shopItems.value.filter(item => item.available).length;
});

// Métodos
const showNotification = (text, color = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color
  };
};

const getWeaponName = (weaponId) => {
  const weapon = weapons.value.find(w => w.id === weaponId);
  return weapon ? weapon.name : `Arma #${weaponId}`;
};

const loadShopItems = async () => {
  loading.value = true;
  try {
    shopItems.value = await fetchShopItems();
  } catch (error) {
    console.error('Error al obtener items de la tienda:', error);
    showNotification('Error al cargar los items de la tienda', 'error');
  } finally {
    loading.value = false;
  }
};

const loadWeapons = async () => {
  try {
    weapons.value = await fetchWeapons();
  } catch (error) {
    console.error('Error al obtener armas:', error);
    showNotification('Error al cargar las armas', 'error');
  }
};

const filterByAvailability = async () => {
  loading.value = true;
  try {
    if (availabilityFilter.value === 'all') {
      await loadShopItems();
    } else if (availabilityFilter.value === 'available') {
      shopItems.value = await fetchAvailableShopItems();
    } else {
      // Para items no disponibles, cargamos todos y filtramos
      const allItems = await fetchShopItems();
      shopItems.value = allItems.filter(item => !item.available);
    }
  } catch (error) {
    console.error('Error al filtrar items:', error);
    showNotification('Error al filtrar los items', 'error');
  } finally {
    loading.value = false;
  }
};

const openDialog = (itemData = null) => {
  editing.value = !!itemData;
  shopItem.value = itemData 
    ? { ...itemData } 
    : { id: null, weaponId: null, price: 0, available: true };
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

const saveShopItem = async () => {
  if (!form.value.validate()) return;
  
  loading.value = true;
  try {
    await saveShopItemService(shopItem.value, editing.value);
    dialog.value = false;
    await loadShopItems();
    showNotification(`Item ${editing.value ? 'actualizado' : 'añadido'} correctamente`);
  } catch (error) {
    console.error('Error al guardar item:', error);
    showNotification(`Error al ${editing.value ? 'actualizar' : 'añadir'} el item: ${error.message}`, 'error');
  } finally {
    loading.value = false;
  }
};

const deleteShopItem = async (id) => {
  loading.value = true;
  try {
    await deleteShopItemService(id);
    dialogDelete.value = false;
    await loadShopItems();
    showNotification('Item eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar item:', error);
    showNotification(`Error al eliminar el item: ${error.message}`, 'error');
  } finally {
    loading.value = false;
  }
};

// Ciclo de vida
onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      loadShopItems(),
      loadWeapons()
    ]);
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.shop-toolbar {
  background: linear-gradient(to right, #5c6bc0, #7986cb);
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
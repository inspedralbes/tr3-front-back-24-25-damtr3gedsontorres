<template>
  <v-container fluid class="pa-4">
    <v-card elevation="4" class="rounded-xl overflow-hidden border">
      <!-- Header con fondo degradado -->
      <v-toolbar flat class="inventory-toolbar px-4" dark>
        <v-toolbar-title class="d-flex align-center">
          <v-icon size="28" class="mr-3">mdi-package-variant-closed</v-icon>
          <span class="text-h5 font-weight-bold">Gestión de Inventario</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar en inventario"
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
                <v-icon dark>mdi-package-variant</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Total Items</div>
                <div class="text-h5 font-weight-bold">{{ inventoryItems.length }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="2" class="rounded-lg stat-card">
            <v-card-text class="d-flex align-center py-4">
              <v-avatar color="teal" size="46" class="mr-4">
                <v-icon dark>mdi-account-group</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Usuarios con Items</div>
                <div class="text-h5 font-weight-bold">{{ uniqueUsers }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="2" class="rounded-lg stat-card">
            <v-card-text class="d-flex align-center py-4">
              <v-avatar color="deep-purple" size="46" class="mr-4">
                <v-icon dark>mdi-sword</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Armas en Inventario</div>
                <div class="text-h5 font-weight-bold">{{ weaponsCount }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filtro por usuario -->
      <v-card-text class="px-4 pt-0 pb-2">
        <v-select
          v-model="selectedUser"
          :items="userOptions"
          label="Filtrar por usuario"
          outlined
          dense
          clearable
          prepend-inner-icon="mdi-filter"
          @change="filterByUser"
          class="max-width-select"
        ></v-select>
      </v-card-text>

      <!-- Tabla de datos mejorada -->
      <v-card-text class="px-4 py-0">
        <v-data-table
          :headers="headers"
          :items="filteredInventory"
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

          <template v-slot:item.userId="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="32" color="teal lighten-4" class="mr-2">
                <v-icon color="teal">mdi-account</v-icon>
              </v-avatar>
              <div class="font-weight-medium">{{ getUserName(item.userId) }}</div>
            </div>
          </template>

          <template v-slot:item.weaponId="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="32" color="blue-grey lighten-4" class="mr-2">
                <v-icon color="blue-grey darken-2">mdi-sword</v-icon>
              </v-avatar>
              <div class="font-weight-medium">{{ getWeaponName(item.weaponId) }}</div>
            </div>
          </template>
          
          <template v-slot:item.equipped="{ item }">
            <v-chip 
              :color="item.equipped ? 'success' : 'grey'" 
              text-color="white" 
              small
              class="px-2"
            >
              {{ item.equipped ? 'Equipado' : 'No equipado' }}
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
              <v-icon x-large color="grey lighten-1" class="mb-4">mdi-package-variant-closed</v-icon>
              <div class="text-h6 grey--text">No hay items en el inventario</div>
              <v-btn color="primary" class="mt-4" @click="loadInventory">
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
                    v-model="inventoryItem.userId"
                    :items="userOptions"
                    label="Usuario"
                    :rules="userRules"
                    required
                    outlined
                    dense
                    prepend-inner-icon="mdi-account"
                  ></v-select>
                </v-col>
                
                <v-col cols="12">
                  <v-select
                    v-model="inventoryItem.weaponId"
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
                  <v-switch
                    v-model="inventoryItem.equipped"
                    label="Equipado"
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
            @click="saveInventoryItem"
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
          ¿Eliminar item del inventario?
        </v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar este item del inventario? Esta acción no se puede deshacer.
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
            @click="deleteInventoryItem(itemToDelete.id)"
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
import { fetchInventoryItems, fetchInventoryByUser, saveInventoryItem as saveInventoryItemService, deleteInventoryItem as deleteInventoryItemService } from '@/services/inventoryService';
import { fetchUsers } from '@/services/userService';
import { fetchWeapons } from '@/services/weaponService';

// Estado reactivo
const search = ref('');
const dialog = ref(false);
const dialogDelete = ref(false);
const loading = ref(false);
const valid = ref(false);
const editing = ref(false);
const selectedUser = ref(null);
const inventoryItems = ref([]);
const users = ref([]);
const weapons = ref([]);
const inventoryItem = ref({ 
  id: null, 
  userId: null, 
  weaponId: null, 
  equipped: false 
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
  { text: 'Usuario', value: 'userId', width: '30%' },
  { text: 'Arma', value: 'weaponId', width: '30%' },
  { text: 'Estado', value: 'equipped', align: 'center', width: '15%' },
  { text: 'Acciones', value: 'actions', sortable: false, align: 'center', width: '10%' }
];

// Reglas de validación
const userRules = [
  v => !!v || 'El usuario es obligatorio'
];

const weaponRules = [
  v => !!v || 'El arma es obligatoria'
];

// Propiedades computadas
const filteredInventory = computed(() => {
  if (!search.value) return inventoryItems.value;
  
  return inventoryItems.value.filter(item => {
    const userName = getUserName(item.userId).toLowerCase();
    const weaponName = getWeaponName(item.weaponId).toLowerCase();
    const searchTerm = search.value.toLowerCase();
    
    return userName.includes(searchTerm) || weaponName.includes(searchTerm);
  });
});

const userOptions = computed(() => {
  return users.value.map(user => ({
    text: user.username,
    value: user.id
  }));
});

const weaponOptions = computed(() => {
  return weapons.value.map(weapon => ({
    text: weapon.name,
    value: weapon.id
  }));
});

const uniqueUsers = computed(() => {
  const uniqueUserIds = new Set(inventoryItems.value.map(item => item.userId));
  return uniqueUserIds.size;
});

const weaponsCount = computed(() => {
  return inventoryItems.value.length;
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

const getWeaponName = (weaponId) => {
  const weapon = weapons.value.find(w => w.id === weaponId);
  return weapon ? weapon.name : `Arma #${weaponId}`;
};

const loadInventory = async () => {
  loading.value = true;
  try {
    inventoryItems.value = await fetchInventoryItems();
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    showNotification('Error al cargar el inventario', 'error');
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

const loadWeapons = async () => {
  try {
    weapons.value = await fetchWeapons();
  } catch (error) {
    console.error('Error al obtener armas:', error);
    showNotification('Error al cargar las armas', 'error');
  }
};

const filterByUser = async () => {
  if (!selectedUser.value) {
    await loadInventory();
    return;
  }
  
  loading.value = true;
  try {
    inventoryItems.value = await fetchInventoryByUser(selectedUser.value);
  } catch (error) {
    console.error(`Error al obtener inventario del usuario ${selectedUser.value}:`, error);
    showNotification('Error al filtrar el inventario', 'error');
  } finally {
    loading.value = false;
  }
};

const openDialog = (itemData = null) => {
  editing.value = !!itemData;
  inventoryItem.value = itemData 
    ? { ...itemData } 
    : { id: null, userId: null, weaponId: null, equipped: false };
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

const saveInventoryItem = async () => {
  if (!form.value.validate()) return;
  
  loading.value = true;
  try {
    await saveInventoryItemService(inventoryItem.value, editing.value);
    dialog.value = false;
    await loadInventory();
    showNotification(`Item ${editing.value ? 'actualizado' : 'añadido'} correctamente`);
  } catch (error) {
    console.error('Error al guardar item:', error);
    showNotification(`Error al ${editing.value ? 'actualizar' : 'añadir'} el item: ${error.message}`, 'error');
  } finally {
    loading.value = false;
  }
};

const deleteInventoryItem = async (id) => {
  loading.value = true;
  try {
    await deleteInventoryItemService(id);
    dialogDelete.value = false;
    await loadInventory();
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
      loadInventory(),
      loadUsers(),
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
.inventory-toolbar {
  background: linear-gradient(to right, #00897b, #4db6ac);
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
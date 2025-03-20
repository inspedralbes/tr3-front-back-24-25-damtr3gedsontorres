<template>
  <v-container fluid class="pa-4">
    <v-card elevation="4" class="rounded-xl overflow-hidden border">
      <!-- Header con fondo degradado -->
      <v-toolbar flat class="weapon-toolbar px-4" dark>
        <v-toolbar-title class="d-flex align-center">
          <v-icon size="28" class="mr-3">mdi-sword-cross</v-icon>
          <span class="text-h5 font-weight-bold">Gestión de Armas</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar arma"
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
          <span class="d-none d-sm-inline">Añadir Arma</span>
        </v-btn>
      </v-toolbar>

      <!-- Tarjetas de estadísticas resumen -->
      <v-row class="mx-2 my-4">
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="2" class="rounded-lg stat-card">
            <v-card-text class="d-flex align-center py-4">
              <v-avatar color="primary" size="46" class="mr-4">
                <v-icon dark>mdi-sword</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Total Armas</div>
                <div class="text-h5 font-weight-bold">{{ weapons.length }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="2" class="rounded-lg stat-card">
            <v-card-text class="d-flex align-center py-4">
              <v-avatar color="deep-orange" size="46" class="mr-4">
                <v-icon dark>mdi-fire</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Daño Promedio</div>
                <div class="text-h5 font-weight-bold">{{ averageDamage }}</div>
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
      </v-row>

      <!-- Tabla de datos mejorada -->
      <v-card-text class="px-4 py-0">
        <v-data-table
          :headers="headers"
          :items="filteredWeapons"
          :loading="loading"
          :items-per-page="10"
          :footer-props="{
            'items-per-page-options': [5, 10, 25, 50, -1],
            'items-per-page-text': 'Armas por página'
          }"
          class="elevation-1 rounded-lg"
        >
          <template v-slot:item.id="{ item }">
            <div class="font-weight-medium text-subtitle-2">#{{ item.id }}</div>
          </template>

          <template v-slot:item.name="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="32" color="blue-grey lighten-4" class="mr-2">
                <v-icon color="blue-grey darken-2">mdi-sword</v-icon>
              </v-avatar>
              <div class="font-weight-medium">{{ item.name }}</div>
            </div>
          </template>

          <template v-slot:item.damage="{ item }">
            <v-chip 
              color="deep-orange" 
              text-color="white" 
              small
              class="px-2"
            >
              {{ item.damage }}
            </v-chip>
          </template>
          
          <template v-slot:item.price="{ item }">
            <div class="d-flex align-center">
              <v-icon color="amber darken-2" small class="mr-2">mdi-currency-usd</v-icon>
              <span>{{ item.price }}</span>
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
              <v-icon x-large color="grey lighten-1" class="mb-4">mdi-sword-cross</v-icon>
              <div class="text-h6 grey--text">No hay armas disponibles</div>
              <v-btn color="primary" class="mt-4" @click="loadWeapons">
                Reintentar
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Diálogo para añadir/editar arma -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card class="pa-2">
        <v-card-title class="text-h5 primary--text">
          {{ editing ? 'Editar Arma' : 'Añadir Arma' }}
        </v-card-title>
        
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="weapon.name"
                    label="Nombre del arma"
                    :rules="nameRules"
                    required
                    outlined
                    dense
                    prepend-inner-icon="mdi-sword"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12">
                  <v-textarea
                    v-model="weapon.description"
                    label="Descripción"
                    :rules="descriptionRules"
                    required
                    outlined
                    dense
                    rows="3"
                    prepend-inner-icon="mdi-text-box"
                  ></v-textarea>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="weapon.damage"
                    label="Daño"
                    :rules="damageRules"
                    required
                    outlined
                    dense
                    type="number"
                    min="1"
                    prepend-inner-icon="mdi-fire"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="weapon.price"
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
                  <v-text-field
                    v-model="weapon.imageUrl"
                    label="URL de la imagen"
                    outlined
                    dense
                    prepend-inner-icon="mdi-image"
                  ></v-text-field>
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
            @click="saveWeapon"
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
          ¿Eliminar arma?
        </v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar el arma <strong>{{ weaponToDelete?.name }}</strong>? Esta acción no se puede deshacer.
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
            @click="deleteWeapon(weaponToDelete.id)"
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
import { fetchWeapons, saveWeapon as saveWeaponService, deleteWeapon as deleteWeaponService } from '@/services/weaponService';

// Estado reactivo
const search = ref('');
const dialog = ref(false);
const dialogDelete = ref(false);
const loading = ref(false);
const valid = ref(false);
const editing = ref(false);
const weapons = ref([]);
const weapon = ref({ 
  id: null, 
  name: '', 
  description: '', 
  damage: 1, 
  price: 0, 
  imageUrl: '' 
});
const weaponToDelete = ref(null);
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
  { text: 'Nombre', value: 'name', width: '30%' },
  { text: 'Descripción', value: 'description', width: '35%' },
  { text: 'Daño', value: 'damage', align: 'center', width: '10%' },
  { text: 'Precio', value: 'price', align: 'center', width: '10%' },
  { text: 'Acciones', value: 'actions', sortable: false, align: 'center', width: '10%' }
];

// Reglas de validación
const nameRules = [
  v => !!v || 'El nombre es obligatorio',
  v => v.length >= 3 || 'El nombre debe tener al menos 3 caracteres'
];

const descriptionRules = [
  v => !!v || 'La descripción es obligatoria',
  v => v.length >= 10 || 'La descripción debe tener al menos 10 caracteres'
];

const damageRules = [
  v => !!v || 'El daño es obligatorio',
  v => v > 0 || 'El daño debe ser mayor que 0'
];

const priceRules = [
  v => !!v || 'El precio es obligatorio',
  v => v >= 0 || 'El precio debe ser mayor o igual a 0'
];

// Propiedades computadas
const filteredWeapons = computed(() => {
  return weapons.value.filter(w => 
    (w.name && w.name.toLowerCase().includes(search.value.toLowerCase())) ||
    (w.description && w.description.toLowerCase().includes(search.value.toLowerCase()))
  );
});

const averageDamage = computed(() => {
  if (weapons.value.length === 0) return 0;
  const total = weapons.value.reduce((sum, weapon) => sum + Number(weapon.damage), 0);
  return Math.round(total / weapons.value.length);
});

const averagePrice = computed(() => {
  if (weapons.value.length === 0) return 0;
  const total = weapons.value.reduce((sum, weapon) => sum + Number(weapon.price), 0);
  return Math.round(total / weapons.value.length);
});

// Métodos
const showNotification = (text, color = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color
  };
};

const loadWeapons = async () => {
  loading.value = true;
  try {
    weapons.value = await fetchWeapons();
  } catch (error) {
    console.error('Error al obtener armas:', error);
    showNotification('Error al cargar las armas', 'error');
  } finally {
    loading.value = false;
  }
};

const openDialog = (weaponData = null) => {
  editing.value = !!weaponData;
  weapon.value = weaponData 
    ? { ...weaponData } 
    : { id: null, name: '', description: '', damage: 1, price: 0, imageUrl: '' };
  dialog.value = true;
  
  // Resetear validación en el siguiente ciclo DOM
  nextTick(() => {
    if (form.value) {
      form.value.resetValidation();
    }
  });
};

const confirmDelete = (weaponData) => {
  weaponToDelete.value = weaponData;
  dialogDelete.value = true;
};

const saveWeapon = async () => {
  if (!form.value.validate()) return;
  
  loading.value = true;
  try {
    await saveWeaponService(weapon.value, editing.value);
    dialog.value = false;
    await loadWeapons();
    showNotification(`Arma ${editing.value ? 'actualizada' : 'creada'} correctamente`);
  } catch (error) {
    console.error('Error al guardar arma:', error);
    showNotification(`Error al ${editing.value ? 'actualizar' : 'crear'} el arma: ${error.message}`, 'error');
  } finally {
    loading.value = false;
  }
};

const deleteWeapon = async (id) => {
  loading.value = true;
  try {
    await deleteWeaponService(id);
    dialogDelete.value = false;
    await loadWeapons();
    showNotification('Arma eliminada correctamente');
  } catch (error) {
    console.error('Error al eliminar arma:', error);
    showNotification(`Error al eliminar el arma: ${error.message}`, 'error');
  } finally {
    loading.value = false;
  }
};

// Ciclo de vida
onMounted(() => {
  loadWeapons();
});
</script>

<style scoped>
.weapon-toolbar {
  background: linear-gradient(to right, #d32f2f, #ff5252);
}

.search-field {
  max-width: 300px;
}

.stat-card {
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}
</style>
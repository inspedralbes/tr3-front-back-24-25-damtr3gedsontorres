<template>
  <v-container fluid class="pa-4">
    <v-card elevation="4" class="rounded-xl overflow-hidden border">
      <!-- Header con fondo degradado -->
      <v-toolbar flat class="wave-toolbar px-4" dark>
        <v-toolbar-title class="d-flex align-center">
          <v-icon size="28" class="mr-3">mdi-wave</v-icon>
          <span class="text-h5 font-weight-bold">Gestión de Oleadas</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar oleada"
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
          <span class="d-none d-sm-inline">Añadir Oleada</span>
        </v-btn>
      </v-toolbar>

      <!-- Tarjetas de estadísticas resumen -->
      <v-row class="mx-2 my-4">
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="2" class="rounded-lg stat-card">
            <v-card-text class="d-flex align-center py-4">
              <v-avatar color="primary" size="46" class="mr-4">
                <v-icon dark>mdi-wave</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Total Oleadas</div>
                <div class="text-h5 font-weight-bold">{{ waves.length }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="2" class="rounded-lg stat-card">
            <v-card-text class="d-flex align-center py-4">
              <v-avatar color="amber darken-2" size="46" class="mr-4">
                <v-icon dark>mdi-skull</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Enemigos Promedio</div>
                <div class="text-h5 font-weight-bold">{{ averageEnemies }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="2" class="rounded-lg stat-card">
            <v-card-text class="d-flex align-center py-4">
              <v-avatar color="success" size="46" class="mr-4">
                <v-icon dark>mdi-trophy</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Nivel Máximo</div>
                <div class="text-h5 font-weight-bold">{{ maxLevel }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filtro de nivel -->
      <v-card-text class="px-4 pt-0 pb-2">
        <v-slider
          v-model="levelFilter"
          :min="1"
          :max="maxLevel || 10"
          label="Filtrar por nivel"
          thumb-label="always"
          class="mt-4"
          @end="filterByLevel"
          color="primary"
        >
          <template v-slot:prepend>
            <v-icon color="primary">mdi-filter</v-icon>
          </template>
          <template v-slot:thumb-label="{ value }">
            {{ value }}
          </template>
        </v-slider>
      </v-card-text>

      <!-- Tabla de datos mejorada -->
      <v-card-text class="px-4 py-0">
        <v-data-table
          :headers="headers"
          :items="filteredWaves"
          :loading="loading"
          :items-per-page="10"
          :footer-props="{
            'items-per-page-options': [5, 10, 25, 50, -1],
            'items-per-page-text': 'Oleadas por página'
          }"
          class="elevation-1 rounded-lg"
        >
          <template v-slot:item.id="{ item }">
            <div class="font-weight-medium text-subtitle-2">#{{ item.id }}</div>
          </template>

          <template v-slot:item.level="{ item }">
            <v-chip 
              color="primary" 
              text-color="white" 
              small
              class="px-2"
            >
              Nivel {{ item.level }}
            </v-chip>
          </template>

          <template v-slot:item.numEnemies="{ item }">
            <div class="d-flex align-center">
              <v-icon color="red darken-2" small class="mr-2">mdi-skull</v-icon>
              <span>{{ item.numEnemies }}</span>
            </div>
          </template>
          
          <template v-slot:item.reward="{ item }">
            <div class="d-flex align-center">
              <v-icon color="amber darken-2" small class="mr-2">mdi-currency-usd</v-icon>
              <span>{{ item.reward }}</span>
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
              <v-icon x-large color="grey lighten-1" class="mb-4">mdi-wave-off</v-icon>
              <div class="text-h6 grey--text">No hay oleadas registradas</div>
              <v-btn color="primary" class="mt-4" @click="loadWaves">
                Reintentar
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Diálogo para añadir/editar oleada -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card class="pa-2">
        <v-card-title class="text-h5 primary--text">
          {{ editing ? 'Editar Oleada' : 'Añadir Oleada' }}
        </v-card-title>
        
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model.number="wave.level"
                    label="Nivel"
                    :rules="levelRules"
                    required
                    outlined
                    dense
                    type="number"
                    min="1"
                    prepend-inner-icon="mdi-numeric"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12">
                  <v-text-field
                    v-model.number="wave.numEnemies"
                    label="Número de Enemigos"
                    :rules="enemiesRules"
                    required
                    outlined
                    dense
                    type="number"
                    min="1"
                    prepend-inner-icon="mdi-skull"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12">
                  <v-text-field
                    v-model.number="wave.reward"
                    label="Recompensa"
                    :rules="rewardRules"
                    required
                    outlined
                    dense
                    type="number"
                    min="0"
                    prepend-inner-icon="mdi-currency-usd"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12">
                  <v-textarea
                    v-model="wave.description"
                    label="Descripción"
                    outlined
                    dense
                    rows="3"
                    prepend-inner-icon="mdi-text"
                    counter="200"
                    :rules="descriptionRules"
                  ></v-textarea>
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
            @click="saveWave"
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
          ¿Eliminar oleada?
        </v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar esta oleada? Esta acción no se puede deshacer.
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
            @click="deleteWave(itemToDelete.id)"
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
import { fetchWaves, fetchWavesByLevel, saveWave as saveWaveService, deleteWave as deleteWaveService } from '@/services/waveService';

// Estado reactivo
const search = ref('');
const dialog = ref(false);
const dialogDelete = ref(false);
const loading = ref(false);
const valid = ref(false);
const editing = ref(false);
const levelFilter = ref(1);
const waves = ref([]);
const wave = ref({ 
  id: null, 
  level: 1, 
  numEnemies: 5, 
  reward: 100,
  description: ''
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
  { text: 'Nivel', value: 'level', align: 'center', width: '15%' },
  { text: 'Enemigos', value: 'numEnemies', align: 'center', width: '15%' },
  { text: 'Recompensa', value: 'reward', align: 'center', width: '15%' },
  { text: 'Descripción', value: 'description', width: '40%' },
  { text: 'Acciones', value: 'actions', sortable: false, align: 'center', width: '10%' }
];

// Reglas de validación
const levelRules = [
  v => !!v || 'El nivel es obligatorio',
  v => v > 0 || 'El nivel debe ser mayor que 0'
];

const enemiesRules = [
  v => !!v || 'El número de enemigos es obligatorio',
  v => v > 0 || 'El número de enemigos debe ser mayor que 0'
];

const rewardRules = [
  v => !!v || 'La recompensa es obligatoria',
  v => v >= 0 || 'La recompensa debe ser mayor o igual a 0'
];

const descriptionRules = [
  v => !v || v.length <= 200 || 'La descripción no puede tener más de 200 caracteres'
];

// Propiedades computadas
const filteredWaves = computed(() => {
  if (!search.value) return waves.value;
  
  const searchTerm = search.value.toLowerCase();
  
  return waves.value.filter(item => {
    return String(item.level).includes(searchTerm) || 
           String(item.numEnemies).includes(searchTerm) || 
           String(item.reward).includes(searchTerm) ||
           (item.description && item.description.toLowerCase().includes(searchTerm));
  });
});

const averageEnemies = computed(() => {
  if (waves.value.length === 0) return 0;
  const total = waves.value.reduce((sum, item) => sum + Number(item.numEnemies), 0);
  return Math.round(total / waves.value.length);
});

const maxLevel = computed(() => {
  if (waves.value.length === 0) return 0;
  return Math.max(...waves.value.map(item => Number(item.level)));
});

// Métodos
const showNotification = (text, color = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color
  };
};

const loadWaves = async () => {
  loading.value = true;
  try {
    waves.value = await fetchWaves();
  } catch (error) {
    console.error('Error al obtener oleadas:', error);
    showNotification('Error al cargar las oleadas', 'error');
  } finally {
    loading.value = false;
  }
};

const filterByLevel = async () => {
  loading.value = true;
  try {
    waves.value = await fetchWavesByLevel(levelFilter.value);
  } catch (error) {
    console.error('Error al filtrar oleadas por nivel:', error);
    showNotification('Error al filtrar las oleadas', 'error');
  } finally {
    loading.value = false;
  }
};

const openDialog = (itemData = null) => {
  editing.value = !!itemData;
  wave.value = itemData 
    ? { ...itemData } 
    : { 
        id: null, 
        level: 1, 
        numEnemies: 5, 
        reward: 100,
        description: ''
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

const saveWave = async () => {
  if (!form.value.validate()) return;
  
  loading.value = true;
  try {
    await saveWaveService(wave.value, editing.value);
    dialog.value = false;
    await loadWaves();
    showNotification(`Oleada ${editing.value ? 'actualizada' : 'añadida'} correctamente`);
  } catch (error) {
    console.error('Error al guardar oleada:', error);
    showNotification(`Error al ${editing.value ? 'actualizar' : 'añadir'} la oleada: ${error.message}`, 'error');
  } finally {
    loading.value = false;
  }
};

const deleteWave = async (id) => {
  loading.value = true;
  try {
    await deleteWaveService(id);
    dialogDelete.value = false;
    await loadWaves();
    showNotification('Oleada eliminada correctamente');
  } catch (error) {
    console.error('Error al eliminar oleada:', error);
    showNotification(`Error al eliminar la oleada: ${error.message}`, 'error');
  } finally {
    loading.value = false;
  }
};

// Ciclo de vida
onMounted(async () => {
  loading.value = true;
  try {
    await loadWaves();
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.wave-toolbar {
  background: linear-gradient(to right, #7e57c2, #9575cd);
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
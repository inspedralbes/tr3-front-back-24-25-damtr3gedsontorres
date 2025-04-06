<template>
  <v-container fluid class="pa-4">
    <v-card elevation="4" class="rounded-xl overflow-hidden border">
      <!-- Header con fondo degradado -->
      <v-toolbar flat class="enemy-toolbar px-4" dark>
        <v-toolbar-title class="d-flex align-center">
          <v-icon size="28" class="mr-3">mdi-sword-cross</v-icon>
          <span class="text-h5 font-weight-bold">Gestión de Enemigos</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar enemigo"
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
          <span class="d-none d-sm-inline">Añadir Enemigo</span>
        </v-btn>
      </v-toolbar>

      <!-- Tarjetas de estadísticas resumen -->
      <v-row class="mx-2 my-4">
        <v-col cols="12" sm="6" md="3">
          <v-card elevation="2" class="rounded-lg stat-card">
            <v-card-text class="d-flex align-center py-4">
              <v-avatar color="primary" size="46" class="mr-4">
                <v-icon dark>mdi-format-list-bulleted</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Total Enemigos</div>
                <div class="text-h5 font-weight-bold">{{ enemies.length }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card elevation="2" class="rounded-lg stat-card">
            <v-card-text class="d-flex align-center py-4">
              <v-avatar color="error" size="46" class="mr-4">
                <v-icon dark>mdi-heart-pulse</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Salud Promedio</div>
                <div class="text-h5 font-weight-bold">{{ getAverageHealth }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card elevation="2" class="rounded-lg stat-card">
            <v-card-text class="d-flex align-center py-4">
              <v-avatar color="deep-purple" size="46" class="mr-4">
                <v-icon dark>mdi-sword</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Ataque Promedio</div>
                <div class="text-h5 font-weight-bold">{{ getAverageAttack }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card elevation="2" class="rounded-lg stat-card">
            <v-card-text class="d-flex align-center py-4">
              <v-avatar color="amber darken-2" size="46" class="mr-4">
                <v-icon dark>mdi-currency-usd</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Recompensa Total</div>
                <div class="text-h5 font-weight-bold">{{ getTotalReward }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Tabla de datos mejorada -->
      <v-card-text class="px-4 py-0">
        <v-data-table
          :headers="headers"
          :items="filteredEnemies"
          :loading="loading"
          :items-per-page="10"
          :footer-props="{
            'items-per-page-options': [5, 10, 25, 50, -1],
            'items-per-page-text': 'Enemigos por página'
          }"
          class="elevation-1 rounded-lg"
        >
          <template v-slot:item.id="{ item }">
            <div class="font-weight-medium text-subtitle-2">#{{ item.id }}</div>
          </template>

          <template v-slot:item.name="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="32" color="grey lighten-4" class="mr-2">
                <v-icon color="grey darken-2">mdi-alien</v-icon>
              </v-avatar>
              <div class="font-weight-medium">{{ item.name }}</div>
            </div>
          </template>

          <template v-slot:item.health="{ item }">
            <div class="d-flex align-center">
              <v-progress-linear
                :value="item.health"
                :color="getHealthColor(item.health)"
                height="6"
                rounded
                class="flex-grow-1 mr-2"
              ></v-progress-linear>
              <v-chip 
                :color="getHealthColor(item.health)" 
                text-color="white" 
                x-small 
                class="px-2 font-weight-medium"
              >
                {{ item.health }}
              </v-chip>
            </div>
          </template>
          
          <template v-slot:item.attack="{ item }">
            <div class="d-flex align-center">
              <v-rating
                :value="Math.min(item.attack / 20, 5)"
                color="red"
                background-color="grey lighten-3"
                half-increments
                dense
                readonly
                small
                length="5"
              ></v-rating>
              <v-chip 
                color="red" 
                text-color="white" 
                x-small 
                class="ml-2 px-2 font-weight-medium"
              >
                {{ item.attack }}
              </v-chip>
            </div>
          </template>
          
          <template v-slot:item.speed="{ item }">
            <div class="d-flex align-center">
              <v-icon 
                v-for="i in Math.min(Math.ceil(item.speed), 5)" 
                :key="i"
                small 
                color="blue"
                class="mr-1"
              >
                mdi-lightning-bolt
              </v-icon>
              <v-chip 
                color="blue" 
                text-color="white" 
                x-small 
                class="ml-1 px-2 font-weight-medium"
              >
                {{ item.speed }}
              </v-chip>
            </div>
          </template>
          
          <template v-slot:item.reward="{ item }">
            <div class="d-flex align-center justify-center">
              <v-icon color="amber darken-2" small class="mr-1">mdi-coin</v-icon>
              <v-chip 
                color="amber darken-2" 
                text-color="white" 
                x-small 
                class="px-2 font-weight-medium"
              >
                {{ item.reward }}
              </v-chip>
            </div>
          </template>
          
          <template v-slot:item.actions="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn 
                  icon 
                  color="primary" 
                  class="mr-1" 
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
          
          <template v-slot:no-data>
            <div class="pa-6 text-center">
              <v-icon size="64" color="grey lighten-2">mdi-emoticon-sad-outline</v-icon>
              <h3 class="text-h6 grey--text text--darken-1 mt-3">No hay enemigos disponibles</h3>
              <v-btn 
                color="primary" 
                outlined 
                class="mt-4" 
                @click="openDialog()"
              >
                <v-icon left>mdi-plus</v-icon>
                Añadir Enemigo
              </v-btn>
            </div>
          </template>
          
          <template v-slot:loading>
            <v-skeleton-loader
              v-for="i in 5"
              :key="i"
              type="table-row"
              class="my-2"
            ></v-skeleton-loader>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Diálogo para añadir/editar enemigo -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card class="pa-2">
        <v-card-title class="text-h5 d-flex align-center">
          <v-icon left color="primary" class="mr-2">
            {{ editing ? 'mdi-pencil' : 'mdi-plus-circle' }}
          </v-icon>
          {{ editing ? 'Editar Enemigo' : 'Añadir Enemigo' }}
        </v-card-title>
        
        <v-divider></v-divider>
        
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation class="mt-4">
            <v-text-field
              v-model="enemy.name"
              label="Nombre"
              :rules="nameRules"
              required
              outlined
              dense
              prepend-inner-icon="mdi-format-title"
            ></v-text-field>
            
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="enemy.health"
                  label="Vida"
                  type="number"
                  :rules="numericRules"
                  required
                  outlined
                  dense
                  prepend-inner-icon="mdi-heart"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="enemy.attack"
                  label="Ataque"
                  type="number"
                  :rules="numericRules"
                  required
                  outlined
                  dense
                  prepend-inner-icon="mdi-sword"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="enemy.speed"
                  label="Velocidad"
                  type="number"
                  :rules="numericRules"
                  required
                  outlined
                  dense
                  prepend-inner-icon="mdi-run-fast"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="enemy.reward"
                  label="Recompensa"
                  type="number"
                  :rules="numericRules"
                  required
                  outlined
                  dense
                  prepend-inner-icon="mdi-coin"
                ></v-text-field>
              </v-col>
            </v-row>
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
            <v-icon left>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            @click="saveEnemy"
            :loading="loading"
            :disabled="!valid"
          >
            <v-icon left>mdi-content-save</v-icon>
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Diálogo para confirmar eliminación -->
    <v-dialog v-model="dialogDelete" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">
          <v-icon left color="error" class="mr-2">mdi-alert-circle</v-icon>
          Confirmar eliminación
        </v-card-title>
        
        <v-card-text>
          ¿Estás seguro de que quieres eliminar al enemigo 
          <strong>{{ enemyToDelete ? enemyToDelete.name : '' }}</strong>?
          <br>Esta acción no se puede deshacer.
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            text
            @click="dialogDelete = false"
            :disabled="loading"
          >
            <v-icon left>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            @click="deleteEnemy(enemyToDelete.id)"
            :loading="loading"
          >
            <v-icon left>mdi-delete</v-icon>
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Snackbar para notificaciones -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="4000"
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
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { fetchEnemies, saveEnemy as saveEnemyService, deleteEnemy as deleteEnemyService } from '@/services/enemyService';

// Estado reactivo
const search = ref('');
const dialog = ref(false);
const dialogDelete = ref(false);
const loading = ref(false);
const valid = ref(false);
const editing = ref(false);
const enemies = ref([]);
const enemy = ref({ id: null, name: '', health: 100, attack: 10, speed: 1.0, reward: 50 });
const enemyToDelete = ref(null);
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
  { text: 'Nombre', value: 'name', width: '25%' },
  { text: 'Vida', value: 'health', align: 'center', width: '20%' },
  { text: 'Ataque', value: 'attack', align: 'center', width: '15%' },
  { text: 'Velocidad', value: 'speed', align: 'center', width: '15%' },
  { text: 'Recompensa', value: 'reward', align: 'center', width: '10%' },
  { text: 'Acciones', value: 'actions', sortable: false, align: 'center', width: '10%' }
];

// Reglas de validación
const nameRules = [
  v => !!v || 'El nombre es obligatorio',
  v => v.length >= 3 || 'El nombre debe tener al menos 3 caracteres'
];

const numericRules = [
  v => v !== null && v !== undefined && v !== '' || 'Este campo es obligatorio',
  v => v >= 0 || 'El valor debe ser positivo'
];

// Propiedades computadas
const filteredEnemies = computed(() => {
  return enemies.value.filter(e => 
    e.name && e.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const getAverageHealth = computed(() => {
  if (enemies.value.length === 0) return 0;
  const total = enemies.value.reduce((sum, enemy) => sum + Number(enemy.health), 0);
  return Math.round(total / enemies.value.length);
});

const getAverageAttack = computed(() => {
  if (enemies.value.length === 0) return 0;
  const total = enemies.value.reduce((sum, enemy) => sum + Number(enemy.attack), 0);
  return Math.round(total / enemies.value.length);
});

const getTotalReward = computed(() => {
  return enemies.value.reduce((sum, enemy) => sum + Number(enemy.reward), 0);
});

// Métodos
const showNotification = (text, color = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color
  };
};

const loadEnemies = async () => {
  loading.value = true;
  try {
    enemies.value = await fetchEnemies();
  } catch (error) {
    console.error('Error al obtener enemigos:', error);
    showNotification('Error al cargar los enemigos', 'error');
  } finally {
    loading.value = false;
  }
};

const openDialog = (enemyData = null) => {
  editing.value = !!enemyData;
  enemy.value = enemyData 
    ? { 
        ...enemyData, 
        health: Number(enemyData.health), 
        attack: Number(enemyData.attack),
        speed: Number(enemyData.speed),
        reward: Number(enemyData.reward)
      } 
    : { id: null, name: '', health: 100, attack: 10, speed: 1.0, reward: 50 };
  dialog.value = true;
  
  // Resetear validación en el siguiente ciclo DOM
  nextTick(() => {
    if (form.value) {
      form.value.resetValidation();
    }
  });
};

const confirmDelete = (enemyData) => {
  enemyToDelete.value = enemyData;
  dialogDelete.value = true;
};

const saveEnemy = async () => {
  if (!form.value.validate()) return;
  
  loading.value = true;
  try {
    await saveEnemyService(enemy.value, editing.value);
    dialog.value = false;
    await loadEnemies();
    showNotification(`Enemigo ${editing.value ? 'actualizado' : 'creado'} correctamente`);
  } catch (error) {
    console.error('Error al guardar enemigo:', error);
    showNotification(`Error al ${editing.value ? 'actualizar' : 'crear'} el enemigo: ${error.message}`, 'error');
  } finally {
    loading.value = false;
  }
};

const deleteEnemy = async (id) => {
  loading.value = true;
  try {
    await deleteEnemyService(id);
    dialogDelete.value = false;
    await loadEnemies();
    showNotification('Enemigo eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar enemigo:', error);
    showNotification(`Error al eliminar el enemigo: ${error.message}`, 'error');
  } finally {
    loading.value = false;
  }
};

const getHealthColor = (health) => {
  if (health > 150) return 'green darken-1';
  if (health > 75) return 'green';
  if (health > 30) return 'orange';
  return 'red';
};

// Ciclo de vida
onMounted(() => {
  loadEnemies();
});
</script>

<style scoped>
.enemy-toolbar {
  background: linear-gradient(to right, #3949ab, #5e35b1);
}

.search-field {
  max-width: 300px;
}

.v-data-table :deep(tbody tr:hover) {
  background-color: rgba(0, 0, 0, 0.03) !important;
}

.stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 4px solid rgba(0, 0, 0, 0.1);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.v-chip {
  font-weight: bold;
}
</style>
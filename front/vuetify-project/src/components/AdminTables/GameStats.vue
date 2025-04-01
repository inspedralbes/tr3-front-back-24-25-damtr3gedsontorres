<template>
  <v-container fluid class="pa-4">
    <v-card elevation="4" class="rounded-xl overflow-hidden border">
      <!-- Header con fondo degradado -->
      <v-toolbar flat class="game-toolbar px-4" dark>
        <v-toolbar-title class="d-flex align-center">
          <v-icon size="28" class="mr-3">mdi-gamepad-variant</v-icon>
          <span class="text-h5 font-weight-bold">Estadísticas de Partidas</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar por email"
          single-line
          hide-details
          filled
          rounded
          dense
          class="mx-2 search-field"
          bg-color="rgba(255, 255, 255, 0.15)"
          @input="filterGames"
        ></v-text-field>
        <v-btn 
          color="success" 
          elevation="2" 
          @click="openStatsDialog()" 
          rounded 
          class="ml-2"
        >
          <v-icon left>mdi-chart-bar</v-icon>
          <span class="d-none d-sm-inline">Estadísticas</span>
        </v-btn>
      </v-toolbar>

      <v-card-text class="px-4 py-0">
        <v-data-table
          :headers="headers"
          :items="filteredGames"
          :loading="loading"
          :items-per-page="10"
          :footer-props="{
            'items-per-page-options': [5, 10, 15, 20],
          }"
          class="elevation-1 my-4"
        >
          <!-- Formato para el tiempo de juego -->
          <template v-slot:item.play_time="{ item }">
            {{ formatPlayTime(item.play_time) }}
          </template>
          
          <!-- Formato para la fecha de último login -->
          <template v-slot:item.last_login="{ item }">
            {{ formatDate(item.last_login) }}
          </template>
          
          <!-- Acciones para cada fila -->
          <template v-slot:item.actions="{ item }">
            <v-btn
              icon
              small
              color="info"
              class="mr-1"
              @click="viewGameDetails(item)"
              title="Ver detalles"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Diálogo para ver detalles de la partida -->
    <v-dialog v-model="detailDialog" max-width="600px">
      <v-card v-if="selectedGame" class="pa-4">
        <v-card-title class="text-h5 primary--text d-flex align-center">
          <v-icon color="primary" class="mr-2">mdi-gamepad-variant</v-icon>
          Detalles de la Partida
          <v-spacer></v-spacer>
          <v-btn icon @click="detailDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-divider class="my-3"></v-divider>
        
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-identifier</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">ID de Partida</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedGame._id }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            
            <v-col cols="12" sm="6">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-email</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">Email del Jugador</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedGame.user_email }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            
            <v-col cols="12" sm="6">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-trophy</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">Puntuación</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedGame.score }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            
            <v-col cols="12" sm="6">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-clock-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">Tiempo de Juego</v-list-item-title>
                  <v-list-item-subtitle>{{ formatPlayTime(selectedGame.play_time) }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            
            <v-col cols="12" sm="6">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-calendar</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">Último Acceso</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDate(selectedGame.last_login) }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            
            <v-col cols="12" sm="6">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-ghost</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">Enemigos Derrotados</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedGame.enemies_defeated }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            
            <v-col cols="12" sm="6">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-bullet</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">Balas Utilizadas</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedGame.bullets_used }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
        </v-card-text>
        
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="detailDialog = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo para estadísticas -->
    <v-dialog v-model="statsDialog" max-width="800px" persistent>
      <v-card class="pa-4">
        <v-card-title class="text-h5 primary--text d-flex align-center">
          <v-icon color="primary" class="mr-2">mdi-chart-bar</v-icon>
          Estadísticas Avanzadas
          <v-spacer></v-spacer>
          <v-btn icon @click="statsDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-divider class="my-3"></v-divider>
        
        <v-card-text>
          <div v-if="loadingStats" class="d-flex flex-column align-center py-5">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
            ></v-progress-circular>
            <p class="mt-4 text-body-1">Cargando estadísticas...</p>
          </div>
          
          <div v-else>
            <v-alert
              type="info"
              outlined
              class="mb-4"
            >
              <v-row align="center">
                <v-col class="grow">
                  Esta sección está preparada para integrar gráficos generados con Python.
                  Próximamente se implementará la conexión con el backend de Python para visualizar
                  estadísticas avanzadas sobre las partidas.
                </v-col>
                <v-col class="shrink">
                  <v-icon large>mdi-language-python</v-icon>
                </v-col>
              </v-row>
            </v-alert>
            
            <v-row>
              <v-col cols="12" sm="6">
                <v-card outlined class="stats-card">
                  <v-card-title class="subtitle-1">
                    <v-icon left color="primary">mdi-account-group</v-icon>
                    Jugadores Activos
                  </v-card-title>
                  <v-card-text class="text-center">
                    <span class="text-h4 font-weight-bold">{{ uniquePlayersCount }}</span>
                    <div class="caption text-secondary mt-1">Jugadores únicos</div>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-card outlined class="stats-card">
                  <v-card-title class="subtitle-1">
                    <v-icon left color="primary">mdi-trophy</v-icon>
                    Puntuación Total
                  </v-card-title>
                  <v-card-text class="text-center">
                    <span class="text-h4 font-weight-bold">{{ totalScore }}</span>
                    <div class="caption text-secondary mt-1">Puntos acumulados</div>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-card outlined class="stats-card">
                  <v-card-title class="subtitle-1">
                    <v-icon left color="primary">mdi-clock-outline</v-icon>
                    Tiempo Total de Juego
                  </v-card-title>
                  <v-card-text class="text-center">
                    <span class="text-h4 font-weight-bold">{{ formatTotalPlayTime }}</span>
                    <div class="caption text-secondary mt-1">Horas acumuladas</div>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-card outlined class="stats-card">
                  <v-card-title class="subtitle-1">
                    <v-icon left color="primary">mdi-ghost</v-icon>
                    Enemigos Derrotados
                  </v-card-title>
                  <v-card-text class="text-center">
                    <span class="text-h4 font-weight-bold">{{ totalEnemiesDefeated }}</span>
                    <div class="caption text-secondary mt-1">En todas las partidas</div>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-card outlined class="stats-card">
                  <v-card-title class="subtitle-1">
                    <v-icon left color="primary">mdi-bullet</v-icon>
                    Balas Utilizadas
                  </v-card-title>
                  <v-card-text class="text-center">
                    <span class="text-h4 font-weight-bold">{{ totalBulletsUsed }}</span>
                    <div class="caption text-secondary mt-1">En todas las partidas</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            
            <div class="text-center mt-6">
              <v-btn
                color="primary"
                outlined
                @click="generatePythonStats"
                :loading="generatingStats"
              >
                <v-icon left>mdi-refresh</v-icon>
                Generar Gráficos con Python
              </v-btn>
              <p class="caption mt-2">
                Esta función conectará con un backend de Python para generar gráficos avanzados
              </p>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchGames, fetchGamesByEmail } from '@/services/gameService';

// Estado
const games = ref([]);
const filteredGames = ref([]);
const search = ref('');
const loading = ref(true);
const loadingStats = ref(false);
const generatingStats = ref(false);
const detailDialog = ref(false);
const statsDialog = ref(false);
const selectedGame = ref(null);

// Cabeceras para la tabla
const headers = ref([
  { text: 'Email del Jugador', value: 'user_email', sortable: true },
  { text: 'Puntuación', value: 'score', sortable: true },
  { text: 'Tiempo de Juego', value: 'play_time', sortable: true },
  { text: 'Enemigos Derrotados', value: 'enemies_defeated', sortable: true },
  { text: 'Balas Utilizadas', value: 'bullets_used', sortable: true },
  { text: 'Último Acceso', value: 'last_login', sortable: true },
  { text: 'Acciones', value: 'actions', sortable: false, align: 'center' }
]);

// Estadísticas calculadas
const uniquePlayersCount = computed(() => {
  const uniqueEmails = new Set(games.value.map(game => game.user_email));
  return uniqueEmails.size;
});

const totalScore = computed(() => {
  return games.value.reduce((total, game) => total + (game.score || 0), 0);
});

const totalPlayTime = computed(() => {
  return games.value.reduce((total, game) => total + (game.play_time || 0), 0);
});

const formatTotalPlayTime = computed(() => {
  const hours = Math.floor(totalPlayTime.value / 3600);
  return `${hours}h`;
});

const totalEnemiesDefeated = computed(() => {
  return games.value.reduce((total, game) => total + (game.enemies_defeated || 0), 0);
});

const totalBulletsUsed = computed(() => {
  return games.value.reduce((total, game) => total + (game.bullets_used || 0), 0);
});

// Métodos
const loadGames = async () => {
  loading.value = true;
  try {
    const data = await fetchGames();
    games.value = data;
    filteredGames.value = [...games.value];
  } catch (error) {
    console.error('Error al cargar los datos de partidas:', error);
    showNotification('Error al cargar los datos de partidas', 'error');
  } finally {
    loading.value = false;
  }
};

const filterGames = async () => {
  if (!search.value || search.value.trim() === '') {
    filteredGames.value = [...games.value];
    return;
  }

  if (search.value.includes('@')) {
    // Si parece un email completo, buscar en el backend
    try {
      loading.value = true;
      const data = await fetchGamesByEmail(search.value);
      filteredGames.value = data;
    } catch (error) {
      console.error('Error al buscar partidas por email:', error);
      showNotification('Error al buscar partidas por email', 'error');
    } finally {
      loading.value = false;
    }
  } else {
    // Filtrar localmente para búsquedas parciales
    filteredGames.value = games.value.filter(game => 
      game.user_email.toLowerCase().includes(search.value.toLowerCase())
    );
  }
};

const formatPlayTime = (seconds) => {
  if (!seconds && seconds !== 0) return 'N/A';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const viewGameDetails = (game) => {
  selectedGame.value = game;
  detailDialog.value = true;
};

const openStatsDialog = () => {
  loadingStats.value = true;
  statsDialog.value = true;
  
  // Simulamos la carga de estadísticas
  setTimeout(() => {
    loadingStats.value = false;
  }, 1000);
};

const generatePythonStats = () => {
  generatingStats.value = true;
  
  // Simulamos la generación de estadísticas con Python
  setTimeout(() => {
    generatingStats.value = false;
    showNotification('La integración con Python está en desarrollo', 'info');
  }, 1500);
};

const showNotification = (text, color = 'success') => {
  // Esta función se puede implementar con el sistema de notificaciones que utilices
  console.log(`[${color}] ${text}`);
  // Si tienes un sistema de notificaciones, úsalo aquí
};

// Ciclo de vida
onMounted(() => {
  loadGames();
});
</script>

<style scoped>
.game-toolbar {
  background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
}

.search-field :deep(.v-text-field__slot input) {
  color: white !important;
}

.search-field :deep(.v-label) {
  color: rgba(255, 255, 255, 0.8) !important;
}

.stats-card {
  height: 100%;
  transition: all 0.3s;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
</style>

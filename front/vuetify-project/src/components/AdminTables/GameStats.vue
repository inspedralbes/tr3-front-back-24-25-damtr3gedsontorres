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
          
          <div v-else-if="!selectedEmail">
            <v-alert
              type="info"
              outlined
              class="mb-4"
            >
              <v-row align="center">
                <v-col class="grow">
                  Selecciona un correo electrónico para generar estadísticas detalladas con Python.
                  Se generarán gráficos de rendimiento para el jugador seleccionado.
                </v-col>
                <v-col class="shrink">
                  <v-icon large>mdi-email-outline</v-icon>
                </v-col>
              </v-row>
            </v-alert>
            
            <v-list class="email-list">
              <v-subheader>Jugadores disponibles</v-subheader>
              <v-list-item
                v-for="email in uniqueEmails"
                :key="email"
                @click="selectEmail(email)"
                link
              >
                <v-list-item-icon>
                  <v-icon color="primary">mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ email }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    icon
                    color="primary"
                    @click.stop="selectEmail(email)"
                  >
                    <v-icon>mdi-chart-bar</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </div>
          
          <div v-else-if="generatingStats" class="d-flex flex-column align-center py-5">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
            ></v-progress-circular>
            <p class="mt-4 text-body-1">Generando gráficos para {{ selectedEmail }}...</p>
          </div>
          
          <div v-else-if="statsGenerated">
            <v-alert
              type="success"
              outlined
              class="mb-4"
            >
              <v-row align="center">
                <v-col class="grow">
                  Estadísticas generadas correctamente para <strong>{{ selectedEmail }}</strong>
                </v-col>
                <v-col class="shrink">
                  <v-btn
                    color="primary"
                    outlined
                    @click="selectedEmail = null"
                  >
                    Cambiar usuario
                  </v-btn>
                </v-col>
              </v-row>
            </v-alert>
            
            <v-row>
              <v-col cols="12" md="4">
                <v-card outlined class="stats-card">
                  <v-card-title class="subtitle-1">
                    <v-icon left color="primary">mdi-chart-pie</v-icon>
                    Media de Enemigos
                  </v-card-title>
                  <v-card-text class="text-center">
                    <v-img
                      v-if="graphPaths.pie"
                      :src="graphPaths.pie"
                      max-height="300"
                      contain
                      class="mx-auto"
                      @error="handleImageError('pie')"
                    ></v-img>
                    <div v-else class="pa-5 text-center">
                      <v-icon large color="grey lighten-1">mdi-image-off</v-icon>
                      <p class="text-caption mt-2">{{ imageErrors.pie || 'Imagen no disponible' }}</p>
                    </div>
                    <div class="d-flex justify-center mt-2">
                      <v-btn
                        v-if="graphPaths.pie"
                        small
                        text
                        color="primary"
                        :href="graphPaths.pie"
                        target="_blank"
                      >
                        <v-icon small left>mdi-open-in-new</v-icon>
                        Ver en tamaño completo
                      </v-btn>
                      <v-btn
                        small
                        text
                        color="secondary"
                        @click="openImageInNewTab('pie')"
                        class="ml-2"
                      >
                        <v-icon small left>mdi-link</v-icon>
                        Ver URL
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" md="4">
                <v-card outlined class="stats-card">
                  <v-card-title class="subtitle-1">
                    <v-icon left color="primary">mdi-chart-bar</v-icon>
                    Balas vs Enemigos
                  </v-card-title>
                  <v-card-text class="text-center">
                    <v-img
                      v-if="graphPaths.bar"
                      :src="graphPaths.bar"
                      max-height="300"
                      contain
                      class="mx-auto"
                      @error="handleImageError('bar')"
                    ></v-img>
                    <div v-else class="pa-5 text-center">
                      <v-icon large color="grey lighten-1">mdi-image-off</v-icon>
                      <p class="text-caption mt-2">{{ imageErrors.bar || 'Imagen no disponible' }}</p>
                    </div>
                    <div class="d-flex justify-center mt-2">
                      <v-btn
                        v-if="graphPaths.bar"
                        small
                        text
                        color="primary"
                        :href="graphPaths.bar"
                        target="_blank"
                      >
                        <v-icon small left>mdi-open-in-new</v-icon>
                        Ver en tamaño completo
                      </v-btn>
                      <v-btn
                        small
                        text
                        color="secondary"
                        @click="openImageInNewTab('bar')"
                        class="ml-2"
                      >
                        <v-icon small left>mdi-link</v-icon>
                        Ver URL
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" md="4">
                <v-card outlined class="stats-card">
                  <v-card-title class="subtitle-1">
                    <v-icon left color="primary">mdi-chart-line</v-icon>
                    Balas por Partida
                  </v-card-title>
                  <v-card-text class="text-center">
                    <v-img
                      v-if="graphPaths.line"
                      :src="graphPaths.line"
                      max-height="300"
                      contain
                      class="mx-auto"
                      @error="handleImageError('line')"
                    ></v-img>
                    <div v-else class="pa-5 text-center">
                      <v-icon large color="grey lighten-1">mdi-image-off</v-icon>
                      <p class="text-caption mt-2">{{ imageErrors.line || 'Imagen no disponible' }}</p>
                    </div>
                    <div class="d-flex justify-center mt-2">
                      <v-btn
                        v-if="graphPaths.line"
                        small
                        text
                        color="primary"
                        :href="graphPaths.line"
                        target="_blank"
                      >
                        <v-icon small left>mdi-open-in-new</v-icon>
                        Ver en tamaño completo
                      </v-btn>
                      <v-btn
                        small
                        text
                        color="secondary"
                        @click="openImageInNewTab('line')"
                        class="ml-2"
                      >
                        <v-icon small left>mdi-link</v-icon>
                        Ver URL
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            
            <v-row class="mt-4">
              <v-col cols="12" md="8">
                <v-card outlined>
                  <v-card-title class="subtitle-1">
                    <v-icon left color="primary">mdi-information-outline</v-icon>
                    Resumen de Estadísticas
                  </v-card-title>
                  <v-card-text>
                    <v-simple-table>
                      <template v-slot:default>
                        <tbody>
                          <tr>
                            <td class="font-weight-medium">Total de partidas:</td>
                            <td>{{ userGamesCount }}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-medium">Puntuación total:</td>
                            <td>{{ userTotalScore }}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-medium">Enemigos derrotados:</td>
                            <td>{{ userTotalEnemies }}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-medium">Balas utilizadas:</td>
                            <td>{{ userTotalBullets }}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-medium">Tiempo de juego:</td>
                            <td>{{ formatPlayTime(userTotalPlayTime) }}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-medium">Eficiencia (enemigos/bala):</td>
                            <td>{{ userTotalBullets > 0 ? (userTotalEnemies / userTotalBullets).toFixed(2) : 'N/A' }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" md="4">
                <v-card outlined>
                  <v-card-title class="subtitle-1">
                    <v-icon left color="primary">mdi-refresh-circle</v-icon>
                    Actualizar Gráficos
                  </v-card-title>
                  <v-card-text class="text-center">
                    <p class="mb-3">¿Los gráficos no se muestran correctamente?</p>
                    <v-btn
                      color="primary"
                      @click="regenerateStats"
                      :loading="generatingStats"
                      :disabled="generatingStats"
                    >
                      <v-icon left>mdi-refresh</v-icon>
                      Regenerar estadísticas
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            
            <v-row v-if="pythonOutput" class="mt-4">
              <v-col cols="12">
                <v-card outlined>
                  <v-card-title class="subtitle-1">
                    <v-icon left color="primary">mdi-console</v-icon>
                    Salida del Proceso Python
                    <v-spacer></v-spacer>
                    <v-btn
                      icon
                      small
                      @click="showPythonOutput = !showPythonOutput"
                      :title="showPythonOutput ? 'Ocultar detalles' : 'Mostrar detalles'"
                    >
                      <v-icon>{{ showPythonOutput ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-expand-transition>
                    <v-card-text v-if="showPythonOutput">
                      <v-alert
                        type="info"
                        text
                        dense
                      >
                        Esta información es útil para depuración.
                      </v-alert>
                      <pre class="python-output">{{ pythonOutput }}</pre>
                    </v-card-text>
                  </v-expand-transition>
                </v-card>
              </v-col>
            </v-row>
          </div>
          
          <div v-else>
            <v-alert
              type="warning"
              outlined
              class="mb-4"
            >
              <v-row align="center">
                <v-col class="grow">
                  Ocurrió un error al generar las estadísticas. Por favor, inténtalo de nuevo.
                </v-col>
                <v-col class="shrink">
                  <v-btn
                    color="warning"
                    @click="generatePythonStats()"
                  >
                    Reintentar
                  </v-btn>
                </v-col>
              </v-row>
            </v-alert>
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
const selectedEmail = ref(null);
const statsGenerated = ref(false);
const graphPaths = ref({
  pie: null,
  bar: null,
  line: null
});
const imageErrors = ref({
  pie: null,
  bar: null,
  line: null
});
const pythonOutput = ref('');
const showPythonOutput = ref(false);

// URL base para las peticiones API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

// Emails únicos para selección
const uniqueEmails = computed(() => {
  const emails = new Set(games.value.map(game => game.user_email));
  return Array.from(emails);
});

// Estadísticas del usuario seleccionado
const userGames = computed(() => {
  if (!selectedEmail.value) return [];
  return games.value.filter(game => game.user_email === selectedEmail.value);
});

const userGamesCount = computed(() => {
  return userGames.value.length;
});

const userTotalScore = computed(() => {
  return userGames.value.reduce((total, game) => total + (game.score || 0), 0);
});

const userTotalEnemies = computed(() => {
  return userGames.value.reduce((total, game) => total + (game.enemies_defeated || 0), 0);
});

const userTotalBullets = computed(() => {
  return userGames.value.reduce((total, game) => total + (game.bullets_used || 0), 0);
});

const userTotalPlayTime = computed(() => {
  return userGames.value.reduce((total, game) => total + (game.play_time || 0), 0);
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
  selectedEmail.value = null;
  statsGenerated.value = false;
  
  // Simulamos la carga de la lista de usuarios
  setTimeout(() => {
    loadingStats.value = false;
  }, 1000);
};

const selectEmail = (email) => {
  selectedEmail.value = email;
  generatePythonStats();
};

const generatePythonStats = async () => {
  if (!selectedEmail.value) return;
  
  generatingStats.value = true;
  statsGenerated.value = false;
  imageErrors.value = { pie: null, bar: null, line: null };
  pythonOutput.value = '';
  
  try {
    // Llamar al endpoint para generar estadísticas
    const response = await fetch(`${API_BASE_URL}/api/stats/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: selectedEmail.value })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al generar estadísticas');
    }
    
    const data = await response.json();
    console.log('Respuesta del servidor:', data);
    
    // Añadimos un timestamp para evitar el caché del navegador
    const timestamp = Date.now();
    
    // Establecer las rutas a los gráficos
    graphPaths.value = {
      pie: data.graphPaths && data.graphPaths.graf1 ? `${API_BASE_URL}${data.graphPaths.graf1}?t=${timestamp}` : null,
      bar: data.graphPaths && data.graphPaths.graf2 ? `${API_BASE_URL}${data.graphPaths.graf2}?t=${timestamp}` : null,
      line: data.graphPaths && data.graphPaths.graf3 ? `${API_BASE_URL}${data.graphPaths.graf3}?t=${timestamp}` : null
    };
    
    console.log('URLs de los gráficos:', graphPaths.value);
    
    // Mostrar la salida del script Python
    pythonOutput.value = data.output || 'No hay información disponible sobre la ejecución del script.';
    
    // Actualizar datos de resumen si están disponibles
    if (data.summaryData) {
      userGamesCount.value = data.summaryData.totalGames || 0;
      userTotalScore.value = 0; // No disponible en la salida actual
      userTotalEnemies.value = data.summaryData.totalEnemies || 0;
      userTotalBullets.value = data.summaryData.totalBullets || 0;
      userTotalPlayTime.value = data.summaryData.totalPlayTime || 0;
    }
    
    statsGenerated.value = true;
    showNotification(`Estadísticas generadas para ${selectedEmail.value}`, 'success');
    
  } catch (error) {
    console.error('Error al generar estadísticas:', error);
    showNotification('Error al generar estadísticas', 'error');
    statsGenerated.value = false;
    pythonOutput.value = `Error: ${error.message}`;
  } finally {
    generatingStats.value = false;
  }
};

const handleImageError = (type) => {
  imageErrors.value[type] = `No se pudo cargar la imagen. Es posible que no se haya generado correctamente.`;
};

const regenerateStats = () => {
  if (selectedEmail.value) {
    generatePythonStats();
  }
};

const showNotification = (text, color = 'success') => {
  // Esta función se puede implementar con el sistema de notificaciones que utilices
  console.log(`[${color}] ${text}`);
  // Si tienes un sistema de notificaciones, úsalo aquí
};

const openImageInNewTab = (type) => {
  if (graphPaths.value[type]) {
    // Mostrar la URL en un diálogo
    alert(`URL de la imagen: ${graphPaths.value[type]}`);
    
    // Verificar que la URL sea válida antes de abrirla
    const url = graphPaths.value[type];
    if (url && typeof url === 'string' && !url.includes('undefined')) {
      // Abrir en una nueva pestaña
      window.open(url, '_blank');
    } else {
      console.error('URL inválida:', url);
      showNotification('URL de imagen inválida', 'error');
    }
  } else {
    showNotification('No hay URL disponible para esta imagen', 'error');
  }
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
  display: flex;
  flex-direction: column;
}

.email-list {
  max-height: 300px;
  overflow-y: auto;
}

.python-output {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  white-space: pre-wrap;
  max-height: 300px;
  overflow-y: auto;
}
</style>

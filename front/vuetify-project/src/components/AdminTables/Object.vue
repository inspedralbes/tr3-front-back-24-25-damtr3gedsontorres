<template>
  <v-container fluid class="pa-4">
    <v-card elevation="4" class="rounded-xl overflow-hidden border">
      <!-- Header con fondo degradado -->
      <v-toolbar flat class="object-toolbar px-4" dark>
        <v-toolbar-title class="d-flex align-center">
          <v-icon size="28" class="mr-3">mdi-cube-outline</v-icon>
          <span class="text-h5 font-weight-bold">Gestión de Objetos</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar objetos"
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
          <span class="d-none d-sm-inline">Añadir Objeto</span>
        </v-btn>
      </v-toolbar>

      <!-- Tarjetas de estadísticas resumen -->
      <v-row class="mx-2 my-4">
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="2" class="rounded-lg stat-card">
            <v-card-text class="d-flex align-center py-4">
              <v-avatar color="primary" size="46" class="mr-4">
                <v-icon dark>mdi-cube-outline</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Total Objetos</div>
                <div class="text-h5 font-weight-bold">{{ objects.length }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Tabla de datos mejorada -->
      <v-card-text class="px-4 py-0">
        <v-data-table
          :headers="headers"
          :items="filteredObjects"
          :loading="loading"
          :search="search"
          :items-per-page="10"
          :footer-props="{
            'items-per-page-options': [5, 10, 25, 50, -1],
            'items-per-page-text': 'Objetos por página'
          }"
          class="elevation-1 rounded-lg"
        >
          <template v-slot:item.id="{ item }">
            <div class="font-weight-medium text-subtitle-2">#{{ item.id }}</div>
          </template>
          
          <template v-slot:item.quantity="{ item }">
            <div class="font-weight-medium">{{ item.quantity }}</div>
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
              <v-icon x-large color="grey lighten-1" class="mb-4">mdi-cube-outline</v-icon>
              <div class="text-h6 grey--text">No hay objetos disponibles</div>
              <v-btn color="primary" class="mt-4" @click="loadObjects">
                Reintentar
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Diálogo para añadir/editar objeto -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card class="pa-2">
        <v-card-title class="text-h5 primary--text">
          {{ editing ? 'Editar Objeto' : 'Añadir Objeto' }}
        </v-card-title>
        
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="editedItem.quantity"
              label="Cantidad"
              type="number"
              min="1"
              :rules="[v => !!v || 'La cantidad es requerida', v => v > 0 || 'La cantidad debe ser mayor a 0']"
              outlined
              dense
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="grey darken-1" 
            text 
            @click="closeDialog"
          >
            Cancelar
          </v-btn>
          <v-btn 
            color="primary" 
            :disabled="!valid"
            @click="saveObject"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación para eliminar -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">
          Confirmar eliminación
        </v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar este objeto? Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="deleteDialog = false">
            Cancelar
          </v-btn>
          <v-btn color="error" @click="deleteObjectItem">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchObjects, saveObject as saveObjectService, deleteObject as deleteObjectService } from '@/services/objectService';

// Estado
const objects = ref([]);
const search = ref('');
const loading = ref(false);
const dialog = ref(false);
const deleteDialog = ref(false);
const valid = ref(true);
const editing = ref(false);
const itemToDelete = ref(null);

// Formulario
const form = ref(null);
const editedItem = ref({
  quantity: 1
});
const defaultItem = {
  quantity: 1
};

// Configuración de la tabla
const headers = ref([
  { text: 'ID', value: 'id', sortable: true },
  { text: 'Cantidad', value: 'quantity', sortable: true },
  { text: 'Acciones', value: 'actions', sortable: false, align: 'center' }
]);

// Computed properties
const filteredObjects = computed(() => {
  return objects.value;
});

// Métodos
const showNotification = (text, color = 'success') => {
  // Implementar notificación (toast, snackbar, etc.)
  console.log(`[${color}] ${text}`);
};

const loadObjects = async () => {
  loading.value = true;
  try {
    objects.value = await fetchObjects();
  } catch (error) {
    showNotification('Error al cargar los objetos', 'error');
  } finally {
    loading.value = false;
  }
};

const openDialog = (itemData = null) => {
  if (itemData) {
    editing.value = true;
    editedItem.value = { ...itemData };
  } else {
    editing.value = false;
    editedItem.value = { ...defaultItem };
  }
  
  dialog.value = true;
  nextTick(() => {
    if (form.value) form.value.resetValidation();
  });
};

const closeDialog = () => {
  dialog.value = false;
  editedItem.value = { ...defaultItem };
};

const confirmDelete = (itemData) => {
  itemToDelete.value = itemData;
  deleteDialog.value = true;
};

const saveObject = async () => {
  if (!form.value.validate()) return;
  
  loading.value = true;
  try {
    const result = await saveObjectService(editedItem.value, editing.value);
    showNotification(
      editing.value ? 'Objeto actualizado correctamente' : 'Objeto creado correctamente'
    );
    await loadObjects();
    closeDialog();
  } catch (error) {
    showNotification(`Error: ${error.message}`, 'error');
  } finally {
    loading.value = false;
  }
};

const deleteObjectItem = async () => {
  if (!itemToDelete.value) return;
  
  loading.value = true;
  try {
    await deleteObjectService(itemToDelete.value.id);
    showNotification('Objeto eliminado correctamente');
    await loadObjects();
    deleteDialog.value = false;
    itemToDelete.value = null;
  } catch (error) {
    showNotification(`Error: ${error.message}`, 'error');
  } finally {
    loading.value = false;
  }
};

// Ciclo de vida
onMounted(async () => {
  loading.value = true;
  try {
    await loadObjects();
  } catch (error) {
    showNotification('Error al cargar los datos iniciales', 'error');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.object-toolbar {
  background: linear-gradient(to right, #3949ab, #1e88e5);
}

.search-field {
  max-width: 300px;
}

.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.max-width-select {
  max-width: 300px;
}
</style>

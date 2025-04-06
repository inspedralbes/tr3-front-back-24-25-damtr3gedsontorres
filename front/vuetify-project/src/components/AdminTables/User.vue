<template>
  <v-container fluid class="pa-4">
    <v-card elevation="4" class="rounded-xl overflow-hidden border">
      <!-- Header con fondo degradado -->
      <v-toolbar flat class="user-toolbar px-4" dark>
        <v-toolbar-title class="d-flex align-center">
          <v-icon size="28" class="mr-3">mdi-account-group</v-icon>
          <span class="text-h5 font-weight-bold">Gestión de Usuarios</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar usuario"
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
          <span class="d-none d-sm-inline">Añadir Usuario</span>
        </v-btn>
      </v-toolbar>

      <!-- Tarjetas de estadísticas resumen -->
      <v-row class="mx-2 my-4">
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="2" class="rounded-lg stat-card">
            <v-card-text class="d-flex align-center py-4">
              <v-avatar color="primary" size="46" class="mr-4">
                <v-icon dark>mdi-account-multiple</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Total Usuarios</div>
                <div class="text-h5 font-weight-bold">{{ users.length }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="2" class="rounded-lg stat-card">
            <v-card-text class="d-flex align-center py-4">
              <v-avatar color="success" size="46" class="mr-4">
                <v-icon dark>mdi-account-check</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Usuarios Activos</div>
                <div class="text-h5 font-weight-bold">{{ getActiveUsers }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="2" class="rounded-lg stat-card">
            <v-card-text class="d-flex align-center py-4">
              <v-avatar color="deep-purple" size="46" class="mr-4">
                <v-icon dark>mdi-account-star</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Administradores</div>
                <div class="text-h5 font-weight-bold">{{ getAdminUsers }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Tabla de datos mejorada -->
      <v-card-text class="px-4 py-0">
        <v-data-table
          :headers="headers"
          :items="filteredUsers"
          :loading="loading"
          :items-per-page="10"
          :footer-props="{
            'items-per-page-options': [5, 10, 25, 50, -1],
            'items-per-page-text': 'Usuarios por página'
          }"
          class="elevation-1 rounded-lg"
        >
          <template v-slot:item.id="{ item }">
            <div class="font-weight-medium text-subtitle-2">#{{ item.id }}</div>
          </template>

          <template v-slot:item.username="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="32" color="primary lighten-4" class="mr-2">
                <v-icon color="primary">mdi-account</v-icon>
              </v-avatar>
              <div class="font-weight-medium">{{ item.username }}</div>
            </div>
          </template>

          <template v-slot:item.email="{ item }">
            <div class="d-flex align-center">
              <v-icon color="blue-grey" small class="mr-2">mdi-email</v-icon>
              <span>{{ item.email }}</span>
            </div>
          </template>
          
          <template v-slot:item.role="{ item }">
            <v-chip 
              :color="item.role === 'admin' ? 'purple' : 'blue'" 
              text-color="white" 
              small
              class="px-2"
            >
              {{ item.role === 'admin' ? 'Administrador' : 'Usuario' }}
            </v-chip>
          </template>
          
          <template v-slot:item.active="{ item }">
            <v-chip 
              :color="item.active ? 'success' : 'grey'" 
              text-color="white" 
              small
              class="px-2"
            >
              {{ item.active ? 'Activo' : 'Inactivo' }}
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
              <v-icon x-large color="grey lighten-1" class="mb-4">mdi-account-off</v-icon>
              <div class="text-h6 grey--text">No hay usuarios disponibles</div>
              <v-btn color="primary" class="mt-4" @click="loadUsers">
                Reintentar
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Diálogo para añadir/editar usuario -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card class="pa-2">
        <v-card-title class="text-h5 primary--text">
          {{ editing ? 'Editar Usuario' : 'Añadir Usuario' }}
        </v-card-title>
        
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="user.username"
                    label="Nombre de usuario"
                    :rules="usernameRules"
                    required
                    outlined
                    dense
                    prepend-inner-icon="mdi-account"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12">
                  <v-text-field
                    v-model="user.email"
                    label="Email"
                    :rules="emailRules"
                    required
                    outlined
                    dense
                    prepend-inner-icon="mdi-email"
                    type="email"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" v-if="!editing">
                  <v-text-field
                    v-model="user.password"
                    label="Contraseña"
                    :rules="passwordRules"
                    required
                    outlined
                    dense
                    prepend-inner-icon="mdi-lock"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="user.role"
                    :items="roles"
                    label="Rol"
                    outlined
                    dense
                    prepend-inner-icon="mdi-shield-account"
                  ></v-select>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-switch
                    v-model="user.active"
                    label="Usuario activo"
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
            @click="saveUser"
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
          ¿Eliminar usuario?
        </v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar al usuario <strong>{{ userToDelete?.username }}</strong>? Esta acción no se puede deshacer.
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
            @click="deleteUser(userToDelete.id)"
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
import { fetchUsers, saveUser as saveUserService, deleteUser as deleteUserService } from '@/services/userService';

// Estado reactivo
const search = ref('');
const dialog = ref(false);
const dialogDelete = ref(false);
const loading = ref(false);
const valid = ref(false);
const editing = ref(false);
const showPassword = ref(false);
const users = ref([]);
const user = ref({ 
  id: null, 
  username: '', 
  email: '', 
  password: '', 
  role: 'user', 
  active: true 
});
const userToDelete = ref(null);
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
  { text: 'Usuario', value: 'username', width: '25%' },
  { text: 'Email', value: 'email', width: '30%' },
  { text: 'Rol', value: 'role', align: 'center', width: '15%' },
  { text: 'Estado', value: 'active', align: 'center', width: '15%' },
  { text: 'Acciones', value: 'actions', sortable: false, align: 'center', width: '10%' }
];

// Opciones para el select de roles
const roles = [
  { text: 'Usuario', value: 'user' },
  { text: 'Administrador', value: 'admin' }
];

// Reglas de validación
const usernameRules = [
  v => !!v || 'El nombre de usuario es obligatorio',
  v => v.length >= 3 || 'El nombre de usuario debe tener al menos 3 caracteres'
];

const emailRules = [
  v => !!v || 'El email es obligatorio',
  v => /.+@.+\..+/.test(v) || 'El email debe ser válido'
];

const passwordRules = [
  v => !editing.value || !!v || 'La contraseña es obligatoria',
  v => !editing.value || v.length >= 6 || 'La contraseña debe tener al menos 6 caracteres'
];

// Propiedades computadas
const filteredUsers = computed(() => {
  return users.value.filter(u => 
    (u.username && u.username.toLowerCase().includes(search.value.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(search.value.toLowerCase()))
  );
});

const getActiveUsers = computed(() => {
  return users.value.filter(u => u.active).length;
});

const getAdminUsers = computed(() => {
  return users.value.filter(u => u.role === 'admin').length;
});

// Métodos
const showNotification = (text, color = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color
  };
};

const loadUsers = async () => {
  loading.value = true;
  try {
    users.value = await fetchUsers();
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    showNotification('Error al cargar los usuarios', 'error');
  } finally {
    loading.value = false;
  }
};

const openDialog = (userData = null) => {
  editing.value = !!userData;
  user.value = userData 
    ? { ...userData } 
    : { id: null, username: '', email: '', password: '', role: 'user', active: true };
  dialog.value = true;
  
  // Resetear validación en el siguiente ciclo DOM
  nextTick(() => {
    if (form.value) {
      form.value.resetValidation();
    }
  });
};

const confirmDelete = (userData) => {
  userToDelete.value = userData;
  dialogDelete.value = true;
};

const saveUser = async () => {
  if (!form.value.validate()) return;
  
  loading.value = true;
  try {
    await saveUserService(user.value, editing.value);
    dialog.value = false;
    await loadUsers();
    showNotification(`Usuario ${editing.value ? 'actualizado' : 'creado'} correctamente`);
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    showNotification(`Error al ${editing.value ? 'actualizar' : 'crear'} el usuario: ${error.message}`, 'error');
  } finally {
    loading.value = false;
  }
};

const deleteUser = async (id) => {
  loading.value = true;
  try {
    await deleteUserService(id);
    dialogDelete.value = false;
    await loadUsers();
    showNotification('Usuario eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    showNotification(`Error al eliminar el usuario: ${error.message}`, 'error');
  } finally {
    loading.value = false;
  }
};

// Ciclo de vida
onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.user-toolbar {
  background: linear-gradient(to right, #1976d2, #64b5f6);
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
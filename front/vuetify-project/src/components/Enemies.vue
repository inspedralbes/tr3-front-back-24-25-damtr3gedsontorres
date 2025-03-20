<template>
  <v-container fluid>
    <v-card elevation="3" class="rounded-lg pa-4">
      <v-toolbar flat color="primary" dark class="rounded-lg">
        <v-toolbar-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-sword-cross</v-icon>
          Gestión de Enemigos
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar enemigo"
          single-line
          hide-details
          filled
          dense
          class="mx-2 search-field"
        ></v-text-field>
        <v-btn color="secondary" elevation="2" @click="openDialog()" rounded small>
          <v-icon left>mdi-plus</v-icon>Añadir Enemigo
        </v-btn>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="filteredEnemies"
        :loading="loading"
        :items-per-page="-1"
        hide-default-footer
        class="elevation-1 mt-4"
      >
        <template v-slot:item.health="{ item }">
          <v-chip :color="getHealthColor(item.health)" text-color="white" small>
            {{ item.health }}
          </v-chip>
        </template>
        
        <template v-slot:item.attack="{ item }">
          <v-chip color="red" text-color="white" small>
            {{ item.attack }}
          </v-chip>
        </template>
        
        <template v-slot:item.speed="{ item }">
          <v-chip color="blue" text-color="white" small>
            {{ item.speed }}
          </v-chip>
        </template>
        
        <template v-slot:item.reward="{ item }">
          <v-chip color="amber darken-2" text-color="white" small>
            {{ item.reward }}
          </v-chip>
        </template>
        
        <template v-slot:item.actions="{ item }">
          <v-btn icon small color="primary" class="mr-2" @click="openDialog(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon small color="error" @click="confirmDelete(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        
        <template v-slot:no-data>
          <v-alert color="info" icon="mdi-information" outlined class="ma-4">
            No hay enemigos disponibles
          </v-alert>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      enemies: [],
      search: '',
      dialog: false,
      dialogDelete: false,
      loading: false,
      valid: false,
      editing: false,
      enemy: { id: null, name: '', health: 100, attack: 10, speed: 1.0, reward: 50 },
      enemyToDelete: null,
      headers: [
        { text: 'ID', value: 'id', width: '5%' },
        { text: 'Nombre', value: 'name', width: '25%' },
        { text: 'Vida', value: 'health', align: 'center', width: '15%' },
        { text: 'Ataque', value: 'attack', align: 'center', width: '15%' },
        { text: 'Velocidad', value: 'speed', align: 'center', width: '15%' },
        { text: 'Recompensa', value: 'reward', align: 'center', width: '15%' },
        { text: 'Acciones', value: 'actions', sortable: false, align: 'center', width: '10%' }
      ],
      nameRules: [
        v => !!v || 'El nombre es obligatorio',
        v => v.length >= 3 || 'El nombre debe tener al menos 3 caracteres'
      ],
      numericRules: [
        v => !!v || 'Este campo es obligatorio',
        v => v >= 0 || 'El valor debe ser positivo'
      ],
      snackbar: {
        show: false,
        text: '',
        color: 'success'
      }
    };
  },
  computed: {
    filteredEnemies() {
      return this.enemies.filter(e => 
        e.name && e.name.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  methods: {
    showNotification(text, color = 'success') {
      this.snackbar = {
        show: true,
        text,
        color
      };
    },
    
    async fetchEnemies() {
      this.loading = true;
      try {
        const response = await fetch('http://localhost:3000/api/enemies/');
        if (!response.ok) {
          throw new Error(`Error de servidor: ${response.status}`);
        }
        this.enemies = await response.json();
      } catch (error) {
        console.error('Error al obtener enemigos:', error);
        this.showNotification('Error al cargar los enemigos', 'error');
      } finally {
        this.loading = false;
      }
    },
    
    openDialog(enemy = null) {
      this.editing = !!enemy;
      this.enemy = enemy 
        ? { 
            ...enemy, 
            health: Number(enemy.health), 
            attack: Number(enemy.attack),
            speed: Number(enemy.speed),
            reward: Number(enemy.reward)
          } 
        : { id: null, name: '', health: 100, attack: 10, speed: 1.0, reward: 50 };
      this.dialog = true;
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },
    
    confirmDelete(enemy) {
      this.enemyToDelete = enemy;
      this.dialogDelete = true;
    },
    
    async saveEnemy() {
      if (!this.$refs.form.validate()) return;
      
      this.loading = true;
      try {
        // Asegurarnos de que los campos numéricos son números
        const enemyData = {
          ...this.enemy,
          health: Number(this.enemy.health),
          attack: Number(this.enemy.attack),
          speed: Number(this.enemy.speed),
          reward: Number(this.enemy.reward)
        };
        
        const method = this.editing ? 'PUT' : 'POST';
        const url = this.editing 
          ? `http://localhost:3000/api/enemies/${this.enemy.id}`
          : 'http://localhost:3000/api/enemies/';
          
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(enemyData)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error en la respuesta del servidor');
        }
        
        this.dialog = false;
        await this.fetchEnemies();
        this.showNotification(`Enemigo ${this.editing ? 'actualizado' : 'creado'} correctamente`);
      } catch (error) {
        console.error('Error al guardar enemigo:', error);
        this.showNotification(`Error al ${this.editing ? 'actualizar' : 'crear'} el enemigo: ${error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },
    
    async deleteEnemy(id) {
      this.loading = true;
      try {
        const response = await fetch(`http://localhost:3000/api/enemies/${id}`, { 
          method: 'DELETE' 
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error en la respuesta del servidor');
        }
        
        this.dialogDelete = false;
        await this.fetchEnemies();
        this.showNotification('Enemigo eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar enemigo:', error);
        this.showNotification(`Error al eliminar el enemigo: ${error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },
    
    getHealthColor(health) {
      if (health > 150) return 'green darken-1';
      if (health > 75) return 'green';
      if (health > 30) return 'orange';
      return 'red';
    }
  },
  mounted() {
    this.fetchEnemies();
  }
};
</script>

<style scoped>
.search-field {
  max-width: 300px;
}

.v-data-table >>> tbody tr:hover {
  background-color: #f5f5f5 !important;
}

.v-chip {
  font-weight: bold;
}
</style>
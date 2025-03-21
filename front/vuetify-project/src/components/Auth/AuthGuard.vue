<template>
  <div>
    <slot v-if="isAuthorized"></slot>
    <v-container v-else class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="elevation-12">
            <v-toolbar color="error" dark flat>
              <v-toolbar-title>Acceso Denegado</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="text-center pa-5">
              <v-icon size="64" color="error" class="mb-4">mdi-shield-alert</v-icon>
              <h2 class="text-h5 mb-2">No tienes permiso para acceder a esta página</h2>
              <p class="mb-4">Debes iniciar sesión como administrador para ver este contenido.</p>
              <v-btn color="primary" @click="goToLogin">Ir al Login</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { isAuthenticated, isAdmin } from '@/services/authService';

export default {
  name: 'AuthGuard',
  props: {
    requireAdmin: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isAuthorized: false
    };
  },
  created() {
    this.checkAuth();
  },
  methods: {
    checkAuth() {
      if (!isAuthenticated()) {
        this.isAuthorized = false;
        return;
      }
      
      if (this.requireAdmin && !isAdmin()) {
        this.isAuthorized = false;
        return;
      }
      
      this.isAuthorized = true;
    },
    goToLogin() {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.fill-height {
  height: 100%;
  min-height: 80vh;
}
</style>

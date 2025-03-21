<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Panel de Administración</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="login">
              <v-alert v-if="error" type="error" class="mb-4">
                {{ error }}
              </v-alert>
              <v-text-field
                v-model="username"
                label="Nombre de usuario"
                name="username"
                prepend-icon="mdi-account"
                type="text"
                :rules="usernameRules"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Contraseña"
                name="password"
                prepend-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                :rules="passwordRules"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              color="primary" 
              @click="login" 
              :loading="loading"
              :disabled="!valid || loading"
            >
              Iniciar sesión
            </v-btn>
          </v-card-actions>
          <v-card-text class="text-center" v-if="!adminExists">
            <v-btn 
              color="secondary" 
              text 
              @click="goToRegisterFirstAdmin"
            >
              Registrar primer administrador
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { login } from '@/services/authService';

export default {
  name: 'LoginView',
  data() {
    return {
      valid: false,
      loading: false,
      username: '',
      password: '',
      showPassword: false,
      error: null,
      adminExists: true, // Por defecto asumimos que ya hay admins
      usernameRules: [
        v => !!v || 'El nombre de usuario es obligatorio',
        v => v.length >= 3 || 'El nombre de usuario debe tener al menos 3 caracteres'
      ],
      passwordRules: [
        v => !!v || 'La contraseña es obligatoria',
        v => v.length >= 6 || 'La contraseña debe tener al menos 6 caracteres'
      ]
    };
  },
  async created() {
    // Verificar si ya existe algún administrador
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/check-admin-exists`);
      if (response.ok) {
        const data = await response.json();
        this.adminExists = data.exists;
      }
    } catch (error) {
      console.error('Error al verificar administradores:', error);
      this.adminExists = false; // Si hay error, permitimos registrar
    }
  },
  methods: {
    async login() {
      if (!this.$refs.form.validate()) return;
      
      this.loading = true;
      this.error = null;
      
      try {
        await login({ username: this.username, password: this.password });
        // Redirigir al dashboard después del login exitoso
        this.$router.push('/admin/dashboard');
      } catch (error) {
        this.error = error.message || 'Error al iniciar sesión';
        console.error('Error detallado:', error);
      } finally {
        this.loading = false;
      }
    },
    goToRegisterFirstAdmin() {
      this.$router.push('/register-first-admin');
    }
  }
};
</script>

<style scoped>
.fill-height {
  height: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>

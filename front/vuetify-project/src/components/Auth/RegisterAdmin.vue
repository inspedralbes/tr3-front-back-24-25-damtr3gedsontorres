<template>
  <v-container fluid>
    <v-card class="mx-auto" max-width="800">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Registrar Nuevo Administrador</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="register">
          <v-alert v-if="error" type="error" class="mb-4">
            {{ error }}
          </v-alert>
          <v-alert v-if="success" type="success" class="mb-4">
            {{ success }}
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
            v-model="email"
            label="Correo electrónico"
            name="email"
            prepend-icon="mdi-email"
            type="email"
            :rules="emailRules"
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

          <v-text-field
            v-model="confirmPassword"
            label="Confirmar contraseña"
            name="confirmPassword"
            prepend-icon="mdi-lock-check"
            :type="showConfirmPassword ? 'text' : 'password'"
            :rules="confirmPasswordRules"
            :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showConfirmPassword = !showConfirmPassword"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="goToDashboard">Volver al login</v-btn>
        <v-spacer></v-spacer>
        <v-btn 
          color="primary" 
          @click="register" 
          :loading="loading"
          :disabled="!valid || loading"
        >
          Registrar Administrador
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { registerAdmin } from '@/services/authService';

export default {
  name: 'RegisterAdminView',
  data() {
    return {
      valid: false,
      loading: false,
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      error: null,
      success: null,
      usernameRules: [
        v => !!v || 'El nombre de usuario es obligatorio',
        v => v.length >= 3 || 'El nombre de usuario debe tener al menos 3 caracteres'
      ],
      emailRules: [
        v => !!v || 'El correo electrónico es obligatorio',
        v => /.+@.+\..+/.test(v) || 'El correo electrónico debe ser válido'
      ],
      passwordRules: [
        v => !!v || 'La contraseña es obligatoria',
        v => v.length >= 6 || 'La contraseña debe tener al menos 6 caracteres'
      ],
      confirmPasswordRules: [
        v => !!v || 'Confirmar la contraseña es obligatorio',
        v => v === this.password || 'Las contraseñas no coinciden'
      ]
    };
  },
  created() {
    // Ya no necesitamos verificar si el usuario está autenticado
  },
  methods: {
    async register() {
      if (!this.$refs.form.validate()) return;
      
      this.loading = true;
      this.error = null;
      this.success = null;
      
      try {
        await registerAdmin({
          username: this.username,
          email: this.email,
          password: this.password
        });
        
        this.success = 'Administrador registrado correctamente. Redirigiendo al dashboard...';
        
        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
          this.$router.push('/admin/dashboard');
        }, 2000);
      } catch (error) {
        this.error = error.message || 'Error al registrar el administrador';
      } finally {
        this.loading = false;
      }
    },
    goToDashboard() {
      this.$router.push('/login');
    }
  }
};
</script>

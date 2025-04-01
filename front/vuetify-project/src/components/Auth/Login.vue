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
                v-model="password"
                label="Contraseña"
                name="password"
                prepend-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                :rules="passwordRules"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                required
                @keyup.enter="login"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="goToRegisterAdmin">Registrarse como Admin</v-btn>
            <v-spacer></v-spacer>
            <v-btn 
              color="primary" 
              @click="login" 
              :loading="loading"
              :disabled="!valid || loading"
              type="submit"
            >
              Iniciar sesión
            </v-btn>
          </v-card-actions>
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
      success: null,
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
  methods: {
    async login() {
      console.log('Método login ejecutado');
      if (!this.$refs.form.validate()) {
        console.log('Validación del formulario fallida');
        return;
      }
      
      this.loading = true;
      this.error = null;
      
      try {
        console.log('Intentando iniciar sesión con:', { username: this.username });
        const result = await login({ username: this.username, password: this.password });
        console.log('Login exitoso:', result);
        
        // Mostrar mensaje de éxito
        this.success = 'Inicio de sesión exitoso. Redirigiendo...';
        
        // Esperar un momento antes de redirigir para asegurar que el token se ha guardado
        setTimeout(() => {
          // Verificar si hay una redirección pendiente en la URL
          const redirectPath = this.$route.query.redirect;
          
          if (redirectPath) {
            console.log('Redirigiendo a:', redirectPath);
            this.$router.push(redirectPath);
          } else {
            // Si no hay redirección, ir al dashboard o a la página principal según el rol
            const user = result.user;
            if (user && user.role === 'admin') {
              console.log('Redirigiendo al dashboard de admin...');
              this.$router.push('/admin/dashboard');
            } else {
              console.log('Redirigiendo a la página principal...');
              // Ajusta esta ruta según tu aplicación
              this.$router.push('/game');
            }
          }
        }, 1000);
      } catch (error) {
        console.error('Error completo:', error);
        this.error = error.message || 'Error al iniciar sesión';
      } finally {
        this.loading = false;
      }
    },
    goToRegisterAdmin() {
      this.$router.push('/admin/register');
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

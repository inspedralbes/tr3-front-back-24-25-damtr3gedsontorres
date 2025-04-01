import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify' // Asegúrate de que está importado
import router from './router'
import {getCurrentUser} from './services/authService'

const app = createApp(App)
app.config.globalProperties.$user = getCurrentUser(); // Mantener el usuario en la instancia de Vue
app.use(router)
app.use(vuetify) // Agregar Vuetify aquí
app.mount('#app')

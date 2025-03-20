import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify' // Asegúrate de que está importado
import router from './router'

const app = createApp(App)
app.use(router)
app.use(vuetify) // Agregar Vuetify aquí
app.mount('#app')

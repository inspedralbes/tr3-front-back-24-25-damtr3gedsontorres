import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import Enemies from '../components/Enemies.vue'
import Inventory from '../components/Inventory.vue'
import Purchase from '../components/Purchase.vue'
import User from '../components/User.vue'
import Shop from '../components/Shop.vue'
import Weapon from '../components/Weapon.vue'
import Wave from '../components/Wave.vue'

const routes = [
  {
    path: '/',
    component: Dashboard, // Dashboard como contenedor principal
    redirect: '/enemies', // Página por defecto al entrar
    children: [
      { path: 'enemies', component: Enemies },
      { path: 'inventory', component: Inventory },
      { path: 'purchase', component: Purchase },
      { path: 'user', component: User },
      { path: 'shop', component: Shop },
      { path: 'weapon', component: Weapon },
      { path: 'wave', component: Wave }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

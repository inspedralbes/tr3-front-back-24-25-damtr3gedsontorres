import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../components/AdminTables/Dashboard.vue'
import Enemies from '../components/AdminTables/Enemies.vue'
import Inventory from '../components/AdminTables/Inventory.vue'
import Purchase from '../components/AdminTables/Purchase.vue'
import User from '../components/AdminTables/User.vue'
import Shop from '../components/AdminTables/Shop.vue'
import Weapon from '../components/AdminTables/Weapon.vue'
import Wave from '../components/AdminTables/Wave.vue'

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

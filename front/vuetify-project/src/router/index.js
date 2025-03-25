import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../components/AdminTables/Dashboard.vue'
import Enemies from '../components/AdminTables/Enemies.vue'
import Inventory from '../components/AdminTables/Inventory.vue'
import Purchase from '../components/AdminTables/Purchase.vue'
import User from '../components/AdminTables/User.vue'
import Shop from '../components/AdminTables/Shop.vue'
import Weapon from '../components/AdminTables/Weapon.vue'
import Wave from '../components/AdminTables/Wave.vue'
import LoginPage from '../pages/Auth/LoginPage.vue'
import RegisterAdminPage from '../pages/Auth/RegisterAdminPage.vue'
import { isAuthenticated, isAdmin } from '../services/authService'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', component: Enemies, meta: { requiresAuth: true, requiresAdmin: true } },
      { path: 'enemies', component: Enemies, meta: { requiresAuth: true, requiresAdmin: true } },
      { path: 'inventory', component: Inventory, meta: { requiresAuth: true, requiresAdmin: true } },
      { path: 'purchase', component: Purchase, meta: { requiresAuth: true, requiresAdmin: true } },
      { path: 'user', component: User, meta: { requiresAuth: true, requiresAdmin: true } },
      { path: 'shop', component: Shop, meta: { requiresAuth: true, requiresAdmin: true } },
      { path: 'weapon', component: Weapon, meta: { requiresAuth: true, requiresAdmin: true } },
      { path: 'wave', component: Wave, meta: { requiresAuth: true, requiresAdmin: true } }
    ]
  },
  {
    path: '/admin/register',
    name: 'RegisterAdmin',
    component: RegisterAdminPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  // Ruta de fallback
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guardia de navegación para proteger rutas
router.beforeEach((to, from, next) => {
  // Verificar si la ruta requiere autenticación
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  
  // Si la ruta no requiere autenticación, permitir acceso directamente
  if (!requiresAuth) {
    next();
    return;
  }
  
  // Comprobar autenticación
  const authenticated = isAuthenticated();
  console.log("Estado de autenticación en beforeEach:", authenticated);
  
  // Si la ruta requiere autenticación y el usuario no está autenticado
  if (!authenticated) {
    // Guardar la ruta a la que se intentaba acceder para redireccionar después del login
    next({ 
      path: '/login', 
      query: { redirect: to.fullPath } 
    });
    return;
  }
  
  // Si la ruta requiere ser admin, verificar el rol
  if (requiresAdmin && !isAdmin()) {
    alert('Acceso denegado: Se requieren permisos de administrador');
    next({ path: '/login' });
    return;
  }
  
  // Si todo está bien, permitir acceso
  next();
});

export default router

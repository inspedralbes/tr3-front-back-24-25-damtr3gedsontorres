<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '@/services/authService'

const router = useRouter()
const isSidebarOpen = ref(true)

const menuItems = [
  { path: '/admin/Dashboard/enemies', name: 'Enemigos', icon: '👾' },
  { path: '/admin/Dashboard/objects', name: 'Objetos', icon: '📦' },
  // { path: '/admin/Dashboard/purchase', name: 'Compras', icon: '💰' },
  { path: '/admin/Dashboard/user', name: 'Usuario', icon: '👤' },
  // { path: '/admin/Dashboard/shop', name: 'Tienda', icon: '🏪' },
  // { path: '/admin/Dashboard/weapon', name: 'Armas', icon: '⚔️' },
  // { path: '/admin/Dashboard/wave', name: 'Oleadas', icon: '🌊' },
  { path: '/admin/Dashboard/game-stats', name: 'Estadísticas', icon: '📊' }
]

const adminItems = [
  { path: '/admin/register', name: 'Registrar Admin', icon: '👑' }
]

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>

<template>
  <div class="dashboard">
    <button 
      class="toggle-btn" 
      @click="toggleSidebar"
      :class="{ 'shifted': !isSidebarOpen }"
    >
      <span v-if="isSidebarOpen">←</span>
      <span v-else>→</span>
    </button>

    <aside class="sidebar" :class="{ 'closed': !isSidebarOpen }">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">G</div>
          <h2>Game Master<span class="version">v1.0</span></h2>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <h3 class="nav-section-title">Gestión del Juego</h3>
        <ul class="menu-list">
          <li v-for="item in menuItems" :key="item.path">
            <router-link :to="item.path" class="nav-link">
              <div class="icon-container">{{ item.icon }}</div>
              <span class="text">{{ item.name }}</span>
              <span class="hover-indicator"></span>
            </router-link>
          </li>
        </ul>
        
        <h3 class="nav-section-title">Administración</h3>
        <ul class="menu-list">
          <li v-for="item in adminItems" :key="item.path">
            <router-link :to="item.path" class="nav-link">
              <div class="icon-container">{{ item.icon }}</div>
              <span class="text">{{ item.name }}</span>
              <span class="hover-indicator"></span>
            </router-link>
          </li>
        </ul>
      </nav>
      
      <div class="sidebar-footer">
        <div class="user-info">
          <div class="avatar">
            <span class="avatar-text">A</span>
          </div>
          <div class="user-details">
            <p class="user-name">Admin</p>
            <p class="user-role">Superusuario</p>
          </div>
        </div>
        <button @click="handleLogout" class="logout-btn">
          <span class="icon">🚪</span>
          <span class="text">Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <main class="content" :class="{ 'expanded': !isSidebarOpen }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #1A1B26;
  position: relative;
  color: #E2E8F0;
}

.toggle-btn {
  position: fixed;
  top: 20px;
  left: 260px;
  background: #6C63FF;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 5px 15px rgba(108, 99, 255, 0.4);
  z-index: 1000;
}

.toggle-btn.shifted {
  left: 20px;
}

.toggle-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(108, 99, 255, 0.6);
}

.sidebar {
  width: 250px;
  background: linear-gradient(135deg, #252836 0%, #1C1E2A 100%);
  color: white;
  padding: 20px 0;
  transition: all 0.3s cubic-bezier(0.65, 0, 0.35, 1);
  box-shadow: 5px 0 25px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: 10;
  position: relative;
}

.sidebar.closed {
  transform: translateX(-100%);
  box-shadow: none;
}

.sidebar-header {
  padding: 0 20px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6C63FF;
  border-radius: 10px;
  font-size: 1.3rem;
  font-weight: bold;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #ffffff;
}

.version {
  font-size: 0.65rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 0.5rem;
  vertical-align: super;
}

.sidebar-nav {
  padding: 20px 10px;
  flex: 1;
  overflow-y: auto;
}

.nav-section-title {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.5);
  margin: 20px 15px 10px;
  font-weight: 600;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin: 4px 0;
  border-radius: 12px;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.nav-link:hover {
  background: rgba(108, 99, 255, 0.1);
  transform: translateX(5px);
}

.nav-link.router-link-active {
  background: rgba(108, 99, 255, 0.15);
  color: #6C63FF;
  font-weight: 500;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.nav-link.router-link-active .icon-container {
  background: #6C63FF;
  color: white;
}

.hover-indicator {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #6C63FF;
  opacity: 0;
  transition: all 0.25s ease;
}

.nav-link:hover .hover-indicator,
.nav-link.router-link-active .hover-indicator {
  opacity: 1;
}

.icon-container {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  margin-right: 12px;
  transition: all 0.25s ease;
}

.nav-link:hover .icon-container {
  transform: rotate(5deg) scale(1.05);
}

.content {
  flex: 1;
  padding: 30px;
  transition: all 0.3s ease;
  margin-left: 0;
  background: #13141F;
  border-radius: 20px 0 0 20px;
  margin-left: -20px;
  z-index: 5;
  overflow: hidden;
  position: relative;
}

.content.expanded {
  margin-left: -270px;
}

.sidebar-footer {
  padding: 15px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: auto;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6C63FF;
  color: white;
  font-weight: bold;
}

.avatar-text {
  font-size: 1.1rem;
}

.user-details {
  flex: 1;
}

.user-name {
  font-weight: 500;
  margin: 0;
  font-size: 0.9rem;
}

.user-role {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  margin: 0;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(239, 68, 68, 0.15);
  color: #EF4444;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.25);
  transform: translateY(-2px);
}

.logout-btn .icon {
  font-size: 1.1rem;
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Scrollbar styling */
.sidebar-nav::-webkit-scrollbar {
  width: 5px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.15);
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    height: 100vh;
    z-index: 999;
  }
  
  .content {
    width: 100%;
    margin-left: 0;
    border-radius: 0;
  }
  
  .toggle-btn {
    left: 20px;
  }
  
  .toggle-btn.shifted {
    left: 260px;
  }
}
</style>
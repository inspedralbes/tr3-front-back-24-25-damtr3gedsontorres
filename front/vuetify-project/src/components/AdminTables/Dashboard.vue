<script setup>
import { ref } from 'vue'

const isSidebarOpen = ref(true)

const menuItems = [
  { path: '/enemies', name: 'Enemigos', icon: '👾' },
  { path: '/inventory', name: 'Inventario', icon: '🎒' },
  { path: '/purchase', name: 'Compras', icon: '💰' },
  { path: '/user', name: 'Usuario', icon: '👤' },
  { path: '/shop', name: 'Tienda', icon: '🏪' },
  { path: '/weapon', name: 'Armas', icon: '⚔️' },
  { path: '/wave', name: 'Oleadas', icon: '🌊' }
]

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
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
        <h2>Game Dashboard</h2>
      </div>
      
      <nav class="sidebar-nav">
        <ul>
          <li v-for="item in menuItems" :key="item.path">
            <router-link :to="item.path" class="nav-link">
              <span class="icon">{{ item.icon }}</span>
              <span class="text">{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </nav>
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
  background: #f8f9fa;
  position: relative;
}

.toggle-btn {
  position: fixed;
  top: 20px;
  left: 260px;
  background: #ffffff;
  color: #2c3e50;
  border: none;
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.toggle-btn.shifted {
  left: 20px;
}

.toggle-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.sidebar {
  width: 250px;
  background: linear-gradient(180deg, #2c3e50 0%, #3498db 100%);
  color: white;
  padding: 20px 0;
  transition: all 0.3s ease;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar.closed {
  transform: translateX(-100%);
  box-shadow: none;
}

.sidebar-header {
  padding: 0 20px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  color: #ffffff;
}

.sidebar-nav {
  padding: 20px 10px;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 12px 20px;
  margin: 4px 0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.icon {
  margin-right: 12px;
  font-size: 1.2em;
}

.content {
  flex: 1;
  padding: 30px;
  transition: all 0.3s ease;
  margin-left: 0;
  background: #ffffff;
}

.content.expanded {
  margin-left: -250px;
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar styling */
.sidebar::-webkit-scrollbar {
  width: 5px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    height: 100vh;
    z-index: 999;
  }
  
  .content {
    margin-left: 0;
    padding: 20px;
  }
  
  .toggle-btn {
    left: 20px;
  }
  
  .toggle-btn.shifted {
    left: 260px;
  }
}
</style>
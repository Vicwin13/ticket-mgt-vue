<template>
  <section class="dashboard">
    <aside class="side" :class="{ collapsed: isCollapsed }">
      <button @click="toggleSidebar" class="toggle-btn">
        {{ isCollapsed ? '→' : '←' }}
      </button>
      <div v-if="!isCollapsed" class="sidebar-content">
        <h3>Navigation</h3>
        <nav class="nav-links">
          <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
          <router-link to="/tickets" class="nav-link">Ticket Management</router-link>
        </nav>
        <button @click="logout" class="logout">Logout</button>
      </div>
    </aside>
    <div class="bigger-side" :class="{ expanded: isCollapsed }">
      <section class="head">
        <div>
          <h1>Welcome, {{ userName }}</h1>
          <p>{{ currentDate }}</p>
        </div>
        <div>The total number tickets</div>
      </section>
      <section class="cards">
        <ticket-card title="Open Ticket" content="50" image="open.svg" />
        <ticket-card title="Closed Ticket" content="60" image="tick.svg" />
        <ticket-card title="Ticket-Total" content="30" image="ticket.svg" />
      </section>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import TicketCard from './TicketCard.vue'

const router = useRouter()
const isCollapsed = ref(false)
const userName = ref('User')

const logout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_id')
  window.location.href = '/login'
}

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const currentDate = computed(() => {
  const now = new Date()
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return now.toLocaleDateString('en-US', options)
})

onMounted(async () => {
  // Get user information
  const userId = localStorage.getItem('user_id')
  if (userId) {
    try {
      // In a real app, you would fetch user data from an API
      // For now, we'll use a mock implementation
      const response = await fetch('/api/users')
      const users = await response.json()
      const user = users.find((u) => u.id === userId)
      if (user) {
        // Extract username from email or use a default
        userName.value = user.email.split('@')[0] || 'User'
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }
})
</script>

<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
}

.side {
  border-right: 2px solid #e0e0e0;
  width: 250px;
  height: 100%;
  background-color: #f8f9fa;
  transition: width 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}

.side.collapsed {
  width: 50px;
}

.toggle-btn {
  position: absolute;
  right: -15px;
  top: 20px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #0066ff;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  font-size: 16px;
}

.sidebar-content {
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-content h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.2rem;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.nav-link {
  padding: 0.75rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: #e9ecef;
}

.nav-link.router-link-active {
  background-color: #0066ff;
  color: white;
}

.logout {
  margin-top: auto;
  padding: 0.75rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout:hover {
  background-color: #c82333;
}

.bigger-side {
  flex: 1;
  width: 100%;
  height: 100%;
  transition: margin-left 0.3s ease;
}

.bigger-side.expanded {
  margin-left: -200px;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 7rem;
  padding: 3rem;
  margin-top: 1rem;
  width: 95%;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.head h1 {
  margin: 0;
  font-size: 2rem;
}

.head p {
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
}

.cards {
  display: flex;
  height: 10rem;
  justify-content: space-evenly;
  margin-top: 20px;
}
</style>

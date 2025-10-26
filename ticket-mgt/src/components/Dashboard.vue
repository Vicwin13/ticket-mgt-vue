<template>
  <section class="dashboard">
    <aside class="side" :class="{ collapsed: isCollapsed }">
      <button @click="toggleSidebar" class="toggle-btn">
        {{ isCollapsed ? '→' : '←' }}
      </button>
      <div v-if="!isCollapsed" class="sidebar-content">
        <h3>Navigation</h3>
        <nav class="nav-links">
          <router-link to="/" class="nav-link">Home</router-link>
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
        <div class="total-tickets">
          <h3>Total Tickets</h3>
          <p class="total-count">{{ ticketStats.total }}</p>
        </div>
      </section>
      <section class="cards">
        <ticket-card title="Open Tickets" :content="ticketStats.open.toString()" image="open.svg" />
        <ticket-card
          title="In Progress"
          :content="ticketStats.inProgress.toString()"
          image="ticket.svg"
        />
        <ticket-card
          title="Closed Tickets"
          :content="ticketStats.closed.toString()"
          image="tick.svg"
        />
      </section>

      <!-- Recent Tickets Section -->
      <section class="recent-tickets">
        <h2>Recent Tickets</h2>
        <div class="tickets-list">
          <div
            v-for="ticket in recentTickets"
            :key="ticket.id"
            class="ticket-item"
            @click="goToTicket(ticket.id)"
          >
            <div class="ticket-info">
              <h4>{{ ticket.title }}</h4>
              <p>{{ truncateDescription(ticket.description) }}</p>
              <div class="ticket-meta">
                <span :class="['status', ticket.status]">{{ formatStatus(ticket.status) }}</span>
                <span :class="['priority', ticket.priority]">{{
                  formatPriority(ticket.priority)
                }}</span>
                <span class="ticket-date">{{ formatDate(ticket.createdAt) }}</span>
              </div>
            </div>
            <div class="ticket-arrow">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </div>
        </div>
        <div v-if="recentTickets.length === 0" class="no-tickets">
          <p>No recent tickets found</p>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import TicketCard from './TicketCard.vue'
import axios from 'axios'

const router = useRouter()
const isCollapsed = ref(false)
const userName = ref('User')
const tickets = ref([])

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

const ticketStats = computed(() => {
  const stats = {
    total: tickets.value.length,
    open: 0,
    inProgress: 0,
    closed: 0,
  }

  tickets.value.forEach((ticket) => {
    switch (ticket.status) {
      case 'open':
        stats.open++
        break
      case 'in-progress':
        stats.inProgress++
        break
      case 'closed':
        stats.closed++
        break
    }
  })

  return stats
})

const recentTickets = computed(() => {
  return tickets.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5) // Show only 5 most recent tickets
})

const fetchTickets = async () => {
  try {
    const response = await axios.get('/api/tickets')
    tickets.value = response.data
  } catch (error) {
    console.error('Error fetching tickets:', error)
  }
}

const goToTicket = (ticketId) => {
  router.push(`/tickets?highlight=${ticketId}`)
}

const truncateDescription = (description) => {
  if (!description) return ''
  return description.length > 50 ? description.substring(0, 50) + '...' : description
}

const formatStatus = (status) => {
  return status
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const formatPriority = (priority) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

const formatDate = (dateString) => {
  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

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
      if (user && user.firstName) {
        // Use first name with capital letter
        userName.value = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
      } else {
        // Fallback to email username if firstName is not available
        userName.value = user ? user.email.split('@')[0] : 'User'
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      // Fallback to stored user name or default
      const storedName = localStorage.getItem('user_name')
      if (storedName) {
        const firstName = storedName.split(' ')[0]
        userName.value = firstName.charAt(0).toUpperCase() + firstName.slice(1)
      } else {
        userName.value = 'User'
      }
    }
  }

  // Fetch tickets for dashboard
  await fetchTickets()
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
  margin-left: -50px;
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

.total-tickets {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}
.total-tickets h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 500;
}
.total-count {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
}
.recent-tickets {
  margin-top: 2rem;
  padding: 0 2rem;
  height: calc(100vh - 400px); /* Set a
fixed height based on viewport */
  display: flex;
  flex-direction: column;
}
.recent-tickets h2 {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
  flex-shrink: 0; /* Prevent the header from
shrinking */
}
.tickets-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  /* Enable vertical scrolling */
  flex: 1; /* Allow the list to grow and fill available space */
  padding-right: 0.5rem; /* Add some padding for scrollbar */
}
.ticket-item {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}
.ticket-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border-left-color: #0066ff;
}
.ticket-info {
  flex: 1;
}
.ticket-info h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}
.ticket-info p {
  margin: 0 0 1rem 0;
  color: #555;
  font-size: 0.9rem;
  line-height: 1.4;
}
.ticket-meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}
.ticket-meta .status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}
.ticket-meta .status.open {
  background-color: #e3f2fd;
  color: #1976d2;
}
.ticket-meta .status.in-progress {
  background-color: #fff8e1;
  color: #f57c00;
}
.ticket-meta .status.closed {
  background-color: #e8f5e9;
  color: #388e3c;
}
.ticket-meta .priority {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}
.ticket-meta .priority.low {
  background-color: #e8f5e9;
  color: #388e3c;
}
.ticket-meta .priority.medium {
  background-color: #fff8e1;
  color: #f57c00;
}
.ticket-meta .priority.high {
  background-color: #ffebee;
  color: #d32f2f;
}
.ticket-date {
  color: #888;
  font-size: 0.75rem;
}
.ticket-arrow {
  color: #666;
  margin-left: 1rem;
  transition: transform 0.3s ease;
}
.ticket-item:hover .ticket-arrow {
  transform: translateX(3px);
}
.no-tickets {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
} /* Responsive Design */
@media (max-width: 768px) {
  .ticket-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .ticket-arrow {
    align-self: flex-end;
  }
  .ticket-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}

/* Additional styles for no-tickets section */
.no-tickets {
  overflow-y: auto;
  flex: 1;
}
</style>

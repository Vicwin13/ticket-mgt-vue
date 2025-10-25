<template>
  <section class="ticket-management">
    <div class="header">
      <h1>Ticket Management</h1>
      <p>Manage and track all your tickets in one place</p>
    </div>

    <div class="ticket-actions">
      <button class="btn-primary">Create New Ticket</button>
      <div class="search-filter">
        <input type="text" placeholder="Search tickets..." class="search-input" />
        <select class="filter-select">
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>
    </div>

    <div class="tickets-container">
      <div class="ticket-list">
        <div v-for="ticket in tickets" :key="ticket.id" class="ticket-item">
          <div class="ticket-header">
            <h3>{{ ticket.title }}</h3>
            <span :class="['status', ticket.status]">{{ ticket.status }}</span>
          </div>
          <p class="ticket-description">{{ ticket.description }}</p>
          <div class="ticket-footer">
            <span class="ticket-date">{{ formatDate(ticket.createdAt) }}</span>
            <div class="ticket-actions">
              <button class="btn-edit">Edit</button>
              <button class="btn-delete">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const tickets = ref([])

const fetchTickets = async () => {
  try {
    const response = await axios.get('/api/tickets')
    tickets.value = response.data
  } catch (error) {
    console.error('Error fetching tickets:', error)
  }
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

onMounted(() => {
  fetchTickets()
})
</script>

<style scoped>
.ticket-management {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  margin-bottom: 2rem;
}

.header h1 {
  color: #333;
  margin-bottom: 0.5rem;
}

.header p {
  color: #666;
}

.ticket-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-primary {
  background-color: #0066ff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #0052cc;
}

.search-filter {
  display: flex;
  gap: 1rem;
}

.search-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 250px;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ticket-item {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.ticket-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.ticket-header h3 {
  margin: 0;
  color: #333;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status.open {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status.in-progress {
  background-color: #fff8e1;
  color: #f57c00;
}

.status.closed {
  background-color: #e8f5e9;
  color: #388e3c;
}

.ticket-description {
  color: #666;
  margin-bottom: 1rem;
}

.ticket-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticket-date {
  color: #888;
  font-size: 0.875rem;
}

.ticket-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s;
}

.btn-edit {
  background-color: #f0f0f0;
  color: #333;
}

.btn-edit:hover {
  background-color: #e0e0e0;
}

.btn-delete {
  background-color: #ffebee;
  color: #d32f2f;
}

.btn-delete:hover {
  background-color: #ffcdd2;
}
</style>

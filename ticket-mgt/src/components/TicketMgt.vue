<template>
  <section class="ticket-management">
    <div class="header">
      <div class="header-left">
        <button class="back-btn" @click="goToDashboard">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to Dashboard
        </button>
        <div class="header-text">
          <h1>Ticket Management</h1>
          <p>Manage and track all your tickets in one place</p>
        </div>
      </div>
    </div>

    <div class="ticket-actions">
      <button class="btn-primary" @click="openCreateModal">Create New Ticket</button>
      <div class="search-filter">
        <input
          type="text"
          placeholder="Search tickets..."
          class="search-input"
          v-model="searchQuery"
        />
        <select class="filter-select" v-model="statusFilter">
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>
    </div>

    <div class="tickets-container">
      <div class="ticket-list">
        <div
          v-for="ticket in filteredTickets"
          :key="ticket.id"
          :class="['ticket-item', { highlighted: ticket.id === highlightedTicketId }]"
        >
          <div class="ticket-header">
            <h3>{{ ticket.title }}</h3>
            <div class="ticket-badges">
              <span :class="['status', ticket.status]">{{ formatStatus(ticket.status) }}</span>
              <span :class="['priority', ticket.priority]">{{
                formatPriority(ticket.priority)
              }}</span>
            </div>
          </div>
          <p class="ticket-description">{{ truncateDescription(ticket.description) }}</p>
          <div class="ticket-footer">
            <span class="ticket-date">{{ formatDate(ticket.createdAt) }}</span>
            <div class="ticket-actions">
              <button class="btn-edit" @click="openEditModal(ticket)">Update</button>
              <button class="btn-delete" @click="deleteTicket(ticket)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ticket Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ isEditMode ? 'Edit Ticket' : 'Create New Ticket' }}</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <form @submit.prevent="saveTicket" class="ticket-form">
          <div class="form-group">
            <label for="title">Title *</label>
            <input
              type="text"
              id="title"
              v-model="ticketForm.title"
              required
              :class="{ error: errors.title }"
            />
            <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
          </div>

          <div class="form-group">
            <label for="description">Description *</label>
            <textarea
              id="description"
              v-model="ticketForm.description"
              required
              rows="4"
              :class="{ error: errors.description }"
            ></textarea>
            <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="ticketForm.status">
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div class="form-group">
              <label for="priority">Priority</label>
              <select id="priority" v-model="ticketForm.priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
            <button type="submit" class="btn-save" :disabled="isSubmitting">
              {{ isSubmitting ? 'Saving...' : isEditMode ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content delete-modal" @click.stop>
        <div class="modal-header">
          <h2>Confirm Delete</h2>
          <button class="close-btn" @click="closeDeleteModal">&times;</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this ticket?</p>
          <p class="ticket-to-delete">{{ ticketToDelete?.title }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click="closeDeleteModal">Cancel</button>
          <button type="button" class="btn-delete-confirm" @click="confirmDelete">Delete</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import { useRoute } from 'vue-router'

const toast = useToast()

// State
const tickets = ref([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditMode = ref(false)
const isSubmitting = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const ticketToDelete = ref(null)

// Form data
const ticketForm = ref({
  id: '',
  title: '',
  description: '',
  status: 'open',
  priority: 'medium',
})

// Form validation errors
const errors = ref({
  title: '',
  description: '',
})

// Computed properties
const filteredTickets = computed(() => {
  let filtered = tickets.value

  // Filter by status
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter((ticket) => ticket.status === statusFilter.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (ticket) =>
        ticket.title.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query),
    )
  }

  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const highlightedTicketId = computed(() => {
  const route = useRoute()
  return route.query.highlight || null
})

// Methods
const fetchTickets = async () => {
  try {
    const response = await axios.get('/api/tickets')
    tickets.value = response.data
  } catch (error) {
    console.error('Error fetching tickets:', error)
    toast.error('Failed to fetch tickets')
  }
}

const validateForm = () => {
  errors.value = {
    title: '',
    description: '',
  }

  let isValid = true

  if (!ticketForm.value.title.trim()) {
    errors.value.title = 'Title is required'
    isValid = false
  } else if (ticketForm.value.title.trim().length < 3) {
    errors.value.title = 'Title must be at least 3 characters'
    isValid = false
  }

  if (!ticketForm.value.description.trim()) {
    errors.value.description = 'Description is required'
    isValid = false
  } else if (ticketForm.value.description.trim().length < 10) {
    errors.value.description = 'Description must be at least 10 characters'
    isValid = false
  }

  return isValid
}

const openCreateModal = () => {
  isEditMode.value = false
  ticketForm.value = {
    id: '',
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
  }
  errors.value = {
    title: '',
    description: '',
  }
  showModal.value = true
}

const openEditModal = (ticket) => {
  isEditMode.value = true
  ticketForm.value = {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority || 'medium',
  }
  errors.value = {
    title: '',
    description: '',
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  errors.value = {
    title: '',
    description: '',
  }
}

const saveTicket = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const ticketData = {
      title: ticketForm.value.title.trim(),
      description: ticketForm.value.description.trim(),
      status: ticketForm.value.status,
      priority: ticketForm.value.priority,
    }

    if (isEditMode.value) {
      // Update existing ticket
      await axios.put(`/api/tickets/${ticketForm.value.id}`, ticketData)
      toast.success('Ticket updated successfully')
    } else {
      // Create new ticket
      const newTicket = {
        ...ticketData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      await axios.post('/api/tickets', newTicket)
      toast.success('Ticket created successfully')
    }

    await fetchTickets()
    closeModal()
  } catch (error) {
    console.error('Error saving ticket:', error)
    toast.error(`Failed to ${isEditMode.value ? 'update' : 'create'} ticket`)
  } finally {
    isSubmitting.value = false
  }
}

const deleteTicket = (ticket) => {
  ticketToDelete.value = ticket
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  ticketToDelete.value = null
}

const confirmDelete = async () => {
  if (!ticketToDelete.value) return

  try {
    await axios.delete(`/api/tickets/${ticketToDelete.value.id}`)
    toast.success('Ticket deleted successfully')
    await fetchTickets()
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting ticket:', error)
    toast.error('Failed to delete ticket')
  }
}

const truncateDescription = (description) => {
  if (!description) return ''
  return description.length > 50 ? description.substring(0, 50) + '...' : description
}

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
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

const goToDashboard = () => {
  router.push('/dashboard')
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

.ticket-item.highlighted {
  border: 2px solid #0066ff;
  background-color: #f0f7ff;
  animation: pulse 2s ease-in-out;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 102, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 102, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 102, 255, 0);
  }
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

/* Form Styles */
.ticket-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #0066ff;
}

.form-group input.error,
.form-group textarea.error {
  border-color: #d32f2f;
}

.error-message {
  color: #d32f2f;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-cancel:hover {
  background-color: #e0e0e0;
}

.btn-save {
  padding: 0.75rem 1.5rem;
  background-color: #0066ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-save:hover {
  background-color: #0052cc;
}

.btn-save:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Ticket Badges */
.ticket-badges {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.priority {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.priority.low {
  background-color: #e8f5e9;
  color: #388e3c;
}

.priority.medium {
  background-color: #fff8e1;
  color: #f57c00;
}

.priority.high {
  background-color: #ffebee;
  color: #d32f2f;
}

/* Delete Modal Styles */
.delete-modal {
  max-width: 400px;
}

.modal-body {
  padding: 1.5rem;
}

.modal-body p {
  margin-bottom: 1rem;
  color: #333;
}

.ticket-to-delete {
  font-weight: 600;
  color: #0066ff;
  padding: 0.5rem;
  background-color: #f0f7ff;
  border-radius: 4px;
  border-left: 4px solid #0066ff;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #eee;
}

.btn-delete-confirm {
  padding: 0.75rem 1.5rem;
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-delete-confirm:hover {
  background-color: #b71c1c;
}

/* Responsive Design */
@media (max-width: 768px) {
  .ticket-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .search-filter {
    flex-direction: column;
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .ticket-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .ticket-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

.header-left { 
  display: flex; 
  align-items: 
  center; gap: 1rem; 
} 
.back-btn { 
  display: flex;
  align-items: center; 
  gap: 0.5rem; 
  padding: 0.75rem 1rem; 
  background-color: #f0f0f0; 
  color: #333;
  border: none; 
  border-radius: 4px; 
  cursor: pointer; 
  font-size: 0.9rem; 
  transition: all 0.3s ease;
  text-decoration: none; 
} 
.back-btn:hover { 
  background-color: #e0e0e0; 
  transform: translateX(-2px); 
}
  .header-text h1 { 
    color: #333; 
    margin-bottom: 0.5rem; 
  } 
  .header-text p { 
    color: #666; 
    margin: 0; 
  }
  </style>

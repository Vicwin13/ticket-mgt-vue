// netlify/functions/tickets.js
const express = require('express');
const router = express.Router();

// Simple in-memory storage (for testing)
let tickets = [];
let ticketIdCounter = 1;

// Get all tickets - GET /tickets
router.get('/', (req, res) => {
  res.json(tickets);
});

// Get ticket by ID - GET /tickets/:id
router.get('/:id', (req, res) => {
  const ticketId = req.params.id;
  const ticket = tickets.find(t => t.id === ticketId);
  
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }
  
  res.json(ticket);
});

// Create ticket - POST /tickets
router.post('/', (req, res) => {
  const { title, description, status, priority } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const newTicket = {
    id: ticketIdCounter.toString(),
    title: title.trim(),
    description: description.trim(),
    status: status || 'open',
    priority: priority || 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tickets.push(newTicket);
  ticketIdCounter++;
  
  res.status(201).json(newTicket);
});

// Update ticket - PUT /tickets/:id
router.put('/:id', (req, res) => {
  const ticketId = req.params.id;
  const { title, description, status, priority } = req.body;
  
  const ticketIndex = tickets.findIndex(t => t.id === ticketId);
  
  if (ticketIndex === -1) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  // Update ticket fields
  if (title !== undefined) tickets[ticketIndex].title = title.trim();
  if (description !== undefined) tickets[ticketIndex].description = description.trim();
  if (status !== undefined) tickets[ticketIndex].status = status;
  if (priority !== undefined) tickets[ticketIndex].priority = priority;
  
  tickets[ticketIndex].updatedAt = new Date().toISOString();

  res.json(tickets[ticketIndex]);
});

// Delete ticket - DELETE /tickets/:id
router.delete('/:id', (req, res) => {
  const ticketId = req.params.id;
  const ticketIndex = tickets.findIndex(t => t.id === ticketId);
  
  if (ticketIndex === -1) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  const deletedTicket = tickets.splice(ticketIndex, 1)[0];
  res.json(deletedTicket);
});

// Export the router
module.exports = router;
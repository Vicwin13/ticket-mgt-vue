// Ticket management functions for Netlify Functions
const fs = require('fs').promises;
const path = require('path');

// Path to the database file
const DB_PATH = path.join(__dirname, '../../src/data/db.json');

// Helper function to read database
async function readDatabase() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    throw new Error('Database read error');
  }
}

// Helper function to write to database
async function writeDatabase(data) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to database:', error);
    throw new Error('Database write error');
  }
}

// Handle ticket requests
exports.handleTicketsRequest = async (request, pathSegments) => {
  const response = {
    statusCode: 200,
    body: '',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    }
  };

  try {
    const db = await readDatabase();
    const { tickets, users } = db;

    // Verify authentication for all endpoints except GET all tickets
    if (request.method !== 'GET' || pathSegments.length > 0) {
      const token = request.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        response.statusCode = 401;
        response.body = JSON.stringify({ error: 'Authorization token required' });
        return response;
      }

      // Verify token
      const user = users.find(u => u.token === token);
      if (!user) {
        response.statusCode = 401;
        response.body = JSON.stringify({ error: 'Invalid token' });
        return response;
      }
    }

    // Handle different endpoints
    if (request.method === 'GET' && pathSegments.length === 0) {
      // Get all tickets
      response.body = JSON.stringify(tickets);
    } 
    else if (request.method === 'GET' && pathSegments.length === 1) {
      // Get ticket by ID
      const ticketId = pathSegments[0];
      const ticket = tickets.find(t => t.id === ticketId);
      
      if (!ticket) {
        response.statusCode = 404;
        response.body = JSON.stringify({ error: 'Ticket not found' });
        return response;
      }

      response.body = JSON.stringify(ticket);
    }
    else if (request.method === 'POST' && pathSegments.length === 0) {
      // Create new ticket
      const { title, description, status, priority } = request.body;
      
      if (!title || !description) {
        response.statusCode = 400;
        response.body = JSON.stringify({ error: 'Title and description are required' });
        return response;
      }

      const newTicket = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        status: status || 'open',
        priority: priority || 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      tickets.push(newTicket);
      await writeDatabase(db);

      response.statusCode = 201;
      response.body = JSON.stringify(newTicket);
    }
    else if (request.method === 'PUT' && pathSegments.length === 1) {
      // Update ticket
      const ticketId = pathSegments[0];
      const { title, description, status, priority } = request.body;
      
      const ticketIndex = tickets.findIndex(t => t.id === ticketId);
      
      if (ticketIndex === -1) {
        response.statusCode = 404;
        response.body = JSON.stringify({ error: 'Ticket not found' });
        return response;
      }

      // Update ticket fields
      if (title !== undefined) tickets[ticketIndex].title = title.trim();
      if (description !== undefined) tickets[ticketIndex].description = description.trim();
      if (status !== undefined) tickets[ticketIndex].status = status;
      if (priority !== undefined) tickets[ticketIndex].priority = priority;
      
      tickets[ticketIndex].updatedAt = new Date().toISOString();

      await writeDatabase(db);
      response.body = JSON.stringify(tickets[ticketIndex]);
    }
    else if (request.method === 'DELETE' && pathSegments.length === 1) {
      // Delete ticket
      const ticketId = pathSegments[0];
      const ticketIndex = tickets.findIndex(t => t.id === ticketId);
      
      if (ticketIndex === -1) {
        response.statusCode = 404;
        response.body = JSON.stringify({ error: 'Ticket not found' });
        return response;
      }

      const deletedTicket = tickets.splice(ticketIndex, 1)[0];
      await writeDatabase(db);

      response.body = JSON.stringify(deletedTicket);
    }
    else {
      response.statusCode = 404;
      response.body = JSON.stringify({ error: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('Tickets API Error:', error);
    response.statusCode = 500;
    response.body = JSON.stringify({ error: 'Internal server error' });
  }

  return response;
};
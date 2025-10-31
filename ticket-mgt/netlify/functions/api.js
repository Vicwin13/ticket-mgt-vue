// netlify/functions/api.js - COMPLETE VERSION WITH TICKETS
let users = [];
let tickets = [];
let userIdCounter = 1;
let ticketIdCounter = 1;

function generateToken(user) {
  return `mocked-jwt-${user.id}-${Date.now()}`;
}

// Helper function to authenticate user from token
function authenticateUser(authHeader) {
  if (!authHeader) return null;
  
  const token = authHeader.replace('Bearer ', '');
  return users.find(user => user.token === token);
}

exports.handler = async (event, context) => {
  console.log('API CALLED:', event.httpMethod, event.path);
  
  // Handle CORS
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const path = event.path.replace('/.netlify/functions/api', '');
  
  try {
    // USER REGISTRATION
    if (event.httpMethod === 'POST' && path === '/users/register') {
      const body = JSON.parse(event.body);
      const { firstName, lastName, email, password } = body;
      
      console.log('Registration attempt:', { email, firstName, lastName });
      
      // Validation
      if (!firstName || !lastName || !email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'All fields are required' })
        };
      }

      // Check if user exists
      if (users.find(u => u.email === email)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'User already exists' })
        };
      }

      // Create user
      const newUser = {
        id: userIdCounter.toString(),
        firstName,
        lastName,
        email,
        password,
        token: generateToken({ id: userIdCounter.toString() })
      };

      users.push(newUser);
      userIdCounter++;

      // Return without password
      const { password: _, ...userResponse } = newUser;
      
      console.log('User registered successfully:', userResponse.email);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          user: userResponse,
          token: newUser.token
        })
      };
    }

    // USER LOGIN
    if (event.httpMethod === 'POST' && path === '/users') {
      const body = JSON.parse(event.body);
      const { email, password } = body;
      
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid credentials' })
        };
      }

      const { password: _, ...userResponse } = user;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          user: userResponse,
          token: user.token
        })
      };
    }

    // GET ALL TICKETS (no auth required for demo)
    if (event.httpMethod === 'GET' && path === '/tickets') {
      console.log('Fetching all tickets, count:', tickets.length);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(tickets)
      };
    }

    // GET SINGLE TICKET
    if (event.httpMethod === 'GET' && path.startsWith('/tickets/')) {
      const ticketId = path.split('/')[2];
      console.log('Fetching ticket:', ticketId);
      
      const ticket = tickets.find(t => t.id === ticketId);
      
      if (!ticket) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Ticket not found' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(ticket)
      };
    }

    // CREATE TICKET (with auth)
    if (event.httpMethod === 'POST' && path === '/tickets') {
      // Check authentication
      const user = authenticateUser(event.headers.authorization);
      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Authentication required' })
        };
      }

      const body = JSON.parse(event.body);
      const { title, description, status, priority } = body;
      
      console.log('Creating ticket:', { title, description, status, priority });
      
      // Validation
      if (!title || !description) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Title and description are required' })
        };
      }

      // Create ticket
      const newTicket = {
        id: ticketIdCounter.toString(),
        title: title.trim(),
        description: description.trim(),
        status: status || 'open',
        priority: priority || 'medium',
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      tickets.push(newTicket);
      ticketIdCounter++;
      
      console.log('Ticket created successfully:', newTicket.id);
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newTicket)
      };
    }

    // UPDATE TICKET (with auth)
    if (event.httpMethod === 'PUT' && path.startsWith('/tickets/')) {
      // Check authentication
      const user = authenticateUser(event.headers.authorization);
      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Authentication required' })
        };
      }

      const ticketId = path.split('/')[2];
      const body = JSON.parse(event.body);
      const { title, description, status, priority } = body;
      
      console.log('Updating ticket:', ticketId, { title, description, status, priority });
      
      const ticketIndex = tickets.findIndex(t => t.id === ticketId);
      
      if (ticketIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Ticket not found' })
        };
      }

      // Update ticket
      if (title !== undefined) tickets[ticketIndex].title = title.trim();
      if (description !== undefined) tickets[ticketIndex].description = description.trim();
      if (status !== undefined) tickets[ticketIndex].status = status;
      if (priority !== undefined) tickets[ticketIndex].priority = priority;
      
      tickets[ticketIndex].updatedAt = new Date().toISOString();

      console.log('Ticket updated successfully:', ticketId);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(tickets[ticketIndex])
      };
    }

    // DELETE TICKET (with auth)
    if (event.httpMethod === 'DELETE' && path.startsWith('/tickets/')) {
      // Check authentication
      const user = authenticateUser(event.headers.authorization);
      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Authentication required' })
        };
      }

      const ticketId = path.split('/')[2];
      console.log('Deleting ticket:', ticketId);
      
      const ticketIndex = tickets.findIndex(t => t.id === ticketId);
      
      if (ticketIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Ticket not found' })
        };
      }

      const deletedTicket = tickets.splice(ticketIndex, 1)[0];
      
      console.log('Ticket deleted successfully:', ticketId);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(deletedTicket)
      };
    }

    // If no route matches
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Route not found: ' + path })
    };

  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error: ' + error.message })
    };
  }
};
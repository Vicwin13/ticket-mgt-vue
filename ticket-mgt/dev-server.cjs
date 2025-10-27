// Development server to simulate Netlify Functions locally
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Path to the database file
const DB_PATH = path.join(__dirname, 'src/data/db.json');

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

// Generate a simple JWT-like token
function generateToken(user) {
  return `mocked-jwt-${user.id}-${Date.now()}`;
}

// Middleware to verify authentication
function verifyAuth(req, res, next) {
  // Skip auth for GET all tickets and login/register
  if ((req.path === '/tickets' && req.method === 'GET') || 
      (req.path === '/users' && req.method === 'POST') ||
      (req.path === '/users/register' && req.method === 'POST')) {
    return next();
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  // For development, we'll just check if token exists
  // In production, you'd verify the token properly
  next();
}

// Apply auth middleware to all routes
app.use('/api', verifyAuth);

// User routes
app.post('/api/users', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = await readDatabase();
    const { users } = db;

    // Find user by email
    const user = users.find(u => u.email === email);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);
    
    // Update user token in database
    user.token = token;
    await writeDatabase(db);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/users/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = await readDatabase();
    const { users } = db;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      password,
      token: generateToken({ id: Date.now().toString() })
    };

    users.push(newUser);
    await writeDatabase(db);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;
    res.json({
      user: userWithoutPassword,
      token: newUser.token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const db = await readDatabase();
    const { users } = db;

    // Return all users without passwords
    const usersWithoutPasswords = users.map(u => {
      const { password: _, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
    
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ticket routes
app.get('/api/tickets', async (req, res) => {
  try {
    const db = await readDatabase();
    res.json(db.tickets);
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/tickets/:id', async (req, res) => {
  try {
    const db = await readDatabase();
    const ticket = db.tickets.find(t => t.id === req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/tickets', async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const db = await readDatabase();
    const newTicket = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      status: status || 'open',
      priority: priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.tickets.push(newTicket);
    await writeDatabase(db);

    res.status(201).json(newTicket);
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/tickets/:id', async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    const db = await readDatabase();
    
    const ticketIndex = db.tickets.findIndex(t => t.id === req.params.id);
    
    if (ticketIndex === -1) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Update ticket fields
    if (title !== undefined) db.tickets[ticketIndex].title = title.trim();
    if (description !== undefined) db.tickets[ticketIndex].description = description.trim();
    if (status !== undefined) db.tickets[ticketIndex].status = status;
    if (priority !== undefined) db.tickets[ticketIndex].priority = priority;
    
    db.tickets[ticketIndex].updatedAt = new Date().toISOString();

    await writeDatabase(db);
    res.json(db.tickets[ticketIndex]);
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/tickets/:id', async (req, res) => {
  try {
    const db = await readDatabase();
    const ticketIndex = db.tickets.findIndex(t => t.id === req.params.id);
    
    if (ticketIndex === -1) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const deletedTicket = db.tickets.splice(ticketIndex, 1)[0];
    await writeDatabase(db);

    res.json(deletedTicket);
  } catch (error) {
    console.error('Delete ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Development server running on http://localhost:${PORT}`);
  console.log('API endpoints available at:');
  console.log('  POST /api/users - Login');
  console.log('  POST /api/users/register - Register');
  console.log('  GET /api/tickets - Get all tickets');
  console.log('  POST /api/tickets - Create ticket');
  console.log('  PUT /api/tickets/:id - Update ticket');
  console.log('  DELETE /api/tickets/:id - Delete ticket');
});
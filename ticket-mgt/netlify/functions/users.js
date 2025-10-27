// User management functions for Netlify Functions
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

// Generate a simple JWT-like token
function generateToken(user) {
  return `mocked-jwt-${user.id}-${Date.now()}`;
}

// Handle user requests
exports.handleUsersRequest = async (request, pathSegments) => {
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
    const { users } = db;

    // Handle different endpoints
    if (request.method === 'POST' && pathSegments.length === 0) {
      // Login endpoint
      const { email, password } = request.body;
      
      if (!email || !password) {
        response.statusCode = 400;
        response.body = JSON.stringify({ error: 'Email and password are required' });
        return response;
      }

      // Find user by email
      const user = users.find(u => u.email === email);
      
      if (!user || user.password !== password) {
        response.statusCode = 401;
        response.body = JSON.stringify({ error: 'Invalid credentials' });
        return response;
      }

      // Generate token
      const token = generateToken(user);
      
      // Update user token in database
      user.token = token;
      await writeDatabase(db);

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;
      response.body = JSON.stringify({
        user: userWithoutPassword,
        token
      });
    } 
    else if (request.method === 'POST' && pathSegments[0] === 'register') {
      // Register endpoint
      const { firstName, lastName, email, password } = request.body;
      
      if (!firstName || !lastName || !email || !password) {
        response.statusCode = 400;
        response.body = JSON.stringify({ error: 'All fields are required' });
        return response;
      }

      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        response.statusCode = 409;
        response.body = JSON.stringify({ error: 'User with this email already exists' });
        return response;
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
      response.body = JSON.stringify({
        user: userWithoutPassword,
        token: newUser.token
      });
    }
    else if (request.method === 'GET' && pathSegments.length === 0) {
      // Get all users (protected endpoint)
      const token = request.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        response.statusCode = 401;
        response.body = JSON.stringify({ error: 'Authorization token required' });
        return response;
      }

      // Verify token (simple check)
      const user = users.find(u => u.token === token);
      if (!user) {
        response.statusCode = 401;
        response.body = JSON.stringify({ error: 'Invalid token' });
        return response;
      }

      // Return all users without passwords
      const usersWithoutPasswords = users.map(u => {
        const { password: _, ...userWithoutPassword } = u;
        return userWithoutPassword;
      });
      
      response.body = JSON.stringify(usersWithoutPasswords);
    }
    else if (request.method === 'GET' && pathSegments.length === 1) {
      // Get user by ID (protected endpoint)
      const token = request.headers.authorization?.replace('Bearer ', '');
      const userId = pathSegments[0];
      
      if (!token) {
        response.statusCode = 401;
        response.body = JSON.stringify({ error: 'Authorization token required' });
        return response;
      }

      // Verify token
      const authenticatedUser = users.find(u => u.token === token);
      if (!authenticatedUser) {
        response.statusCode = 401;
        response.body = JSON.stringify({ error: 'Invalid token' });
        return response;
      }

      // Find user by ID
      const user = users.find(u => u.id === userId);
      if (!user) {
        response.statusCode = 404;
        response.body = JSON.stringify({ error: 'User not found' });
        return response;
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      response.body = JSON.stringify(userWithoutPassword);
    }
    else {
      response.statusCode = 404;
      response.body = JSON.stringify({ error: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('Users API Error:', error);
    response.statusCode = 500;
    response.body = JSON.stringify({ error: 'Internal server error' });
  }

  return response;
};
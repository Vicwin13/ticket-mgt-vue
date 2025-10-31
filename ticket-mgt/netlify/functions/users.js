// netlify/functions/users.js
const express = require('express');
const router = express.Router();

// Simple in-memory storage (for testing)
let users = [];
let userIdCounter = 1;

// Generate a simple JWT-like token
function generateToken(user) {
  return `mocked-jwt-${user.id}-${Date.now()}`;
}

// Login - POST /users
router.post('/', (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Generate token
  const token = generateToken(user);
  user.token = token;
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({ 
    user: userWithoutPassword,
    token
  });
});

// Register - POST /users/register  
router.post('/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  // Check if user exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
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
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.json({ 
    user: userWithoutPassword,
    token: newUser.token
  });
});

// Export the router
module.exports = router;
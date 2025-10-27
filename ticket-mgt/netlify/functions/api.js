// Main API router for Netlify Functions
const router = require('express')();

// Import route handlers
const usersRouter = require('./users');
const ticketsRouter = require('./tickets');

// Use route handlers
router.use('/users', usersRouter);
router.use('/tickets', ticketsRouter);

// Export handler for Netlify Functions
exports.handler = async (event, context) => {
  // Convert the event to an Express-like request
  const request = {
    method: event.httpMethod,
    path: event.path,
    query: event.queryStringParameters || {},
    body: event.body ? JSON.parse(event.body) : {},
    headers: event.headers || {}
  };

  // Mock Express response object
  let response = {
    statusCode: 200,
    body: '',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    }
  };

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return response;
  }

  try {
    // Route handling
    const pathSegments = request.path.split('/').filter(segment => segment);
    
    // Remove 'api' from the beginning if present
    if (pathSegments[0] === 'api') {
      pathSegments.shift();
    }

    // Route to appropriate handler
    if (pathSegments[0] === 'users') {
      response = await handleUsersRequest(request, pathSegments.slice(1));
    } else if (pathSegments[0] === 'tickets') {
      response = await handleTicketsRequest(request, pathSegments.slice(1));
    } else {
      response.statusCode = 404;
      response.body = JSON.stringify({ error: 'Not found' });
    }
  } catch (error) {
    console.error('API Error:', error);
    response.statusCode = 500;
    response.body = JSON.stringify({ error: 'Internal server error' });
  }

  return response;
};

// Import handlers
const { handleUsersRequest } = require('./users');
const { handleTicketsRequest } = require('./tickets');
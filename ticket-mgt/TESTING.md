# Testing the API Endpoints

This document explains how to test the API endpoints for both the local development server and the Netlify Functions.

## Prerequisites

1. Make sure you have all dependencies installed:
   ```bash
   npm install
   ```

2. Make sure you have the required dependencies for the Netlify Functions:
   ```bash
   cd netlify/functions
   npm install
   cd ../..
   ```

## Testing Options

### Option 1: Testing the Local Development Server

The local development server uses a JSON file for data persistence and runs on port 3002.

1. Start the local development server:
   ```bash
   npm run dev-server
   ```

2. In a new terminal, run the test script:
   ```bash
   node test-endpoints.js
   ```

### Option 2: Testing the Netlify Functions

The Netlify Functions use in-memory storage (data doesn't persist between function invocations).

1. Start the Netlify Functions development server:
   ```bash
   npm run dev
   ```
   This will start both the Vite dev server and the Netlify Functions server.

2. In a new terminal, run the Netlify Functions test script:
   ```bash
   node test-netlify-functions.js
   ```

## Test Coverage

Both test scripts cover the following endpoints:

### User Endpoints
- `POST /users/register` - User registration
- `POST /users` - User login
- `GET /users` - Get all users (requires authentication)
- `GET /users/:id` - Get user by ID (requires authentication)

### Ticket Endpoints
- `GET /tickets` - Get all tickets (no authentication required)
- `GET /tickets/:id` - Get ticket by ID (requires authentication)
- `POST /tickets` - Create new ticket (requires authentication)
- `PUT /tickets/:id` - Update ticket (requires authentication)
- `DELETE /tickets/:id` - Delete ticket (requires authentication)

### Error Cases
- Invalid login credentials
- Accessing protected endpoints without authentication
- Creating tickets with missing required fields

## Key Differences Between Local Server and Netlify Functions

1. **Data Persistence**:
   - Local server: Uses `src/data/db.json` for persistent storage
   - Netlify Functions: Uses in-memory storage (data resets on each function invocation)

2. **Base URLs**:
   - Local server: `http://localhost:3002/api`
   - Netlify Functions: `http://localhost:8888/.netlify/functions/api`

3. **Authentication**:
   - Local server: Verifies tokens against the database
   - Netlify Functions: Simple token verification (checks if token starts with 'mocked-jwt-')

## Troubleshooting

1. **Connection refused errors**: Make sure the development server is running before executing the test scripts.

2. **Module not found errors**: Make sure all dependencies are installed in both the root directory and the `netlify/functions` directory.

3. **Authentication errors**: The test scripts automatically handle authentication tokens, but if you're testing manually, make sure to include the `Authorization: Bearer <token>` header for protected endpoints.

4. **Data inconsistencies**: Since Netlify Functions use in-memory storage, data created in one test might not be available in subsequent tests if the function instance is recycled.
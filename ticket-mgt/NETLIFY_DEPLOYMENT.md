# Netlify Functions Deployment Guide

This guide explains how to deploy your Vue.js ticket management application with Netlify Functions as a serverless backend.

## Overview

The application has been configured to use Netlify Functions to simulate a backend in a serverless environment. This allows others to use your database through API endpoints without needing to set up a traditional server.

## Architecture

- **Frontend**: Vue.js application
- **Backend**: Netlify Functions (serverless)
- **Database**: JSON file stored in the project (for simplicity)
- **Authentication**: Token-based authentication

## Project Structure

```
ticket-mgt/
├── netlify/
│   └── functions/
│       ├── api.js          # Main API router
│       ├── users.js        # User authentication functions
│       ├── tickets.js      # Ticket management functions
│       └── package.json    # Functions dependencies
├── src/
│   ├── components/         # Vue components
│   └── data/
│       └── db.json         # Database file
├── netlify.toml           # Netlify configuration
├── dev-server.js          # Development server
└── package.json           # Project dependencies
```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   
   This will start both the Vite development server and the API development server concurrently.

3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/users` - Login
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `POST /api/users/register` - Register new user
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Tickets

- `GET /api/tickets` - Get all tickets (no auth required)
- `GET /api/tickets/:id` - Get ticket by ID (auth required)
- `POST /api/tickets` - Create new ticket (auth required)
  ```json
  {
    "title": "Ticket Title",
    "description": "Ticket description",
    "status": "open",
    "priority": "medium"
  }
  ```
- `PUT /api/tickets/:id` - Update ticket (auth required)
- `DELETE /api/tickets/:id` - Delete ticket (auth required)

## Authentication

All ticket operations (except GET all tickets) require authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

The token is obtained from the login or registration response.

## Deployment to Netlify

1. **Create a Netlify Account**
   - Go to [netlify.com](https://netlify.com) and create an account

2. **Connect Your Repository**
   - Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
   - In Netlify, click "New site from Git" and connect your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

4. **Environment Variables** (if needed)
   - Add any environment variables in the Netlify dashboard

5. **Deploy**
   - Netlify will automatically build and deploy your site
   - Your functions will be available at `/.netlify/functions/api`

## Production Considerations

### Database Persistence

The current implementation uses a JSON file for simplicity. For production:

1. **Use a real database** (MongoDB, PostgreSQL, etc.)
2. **Store database credentials in environment variables**
3. **Implement proper data validation and sanitization**

### Security

1. **Implement proper JWT validation** instead of simple token checking
2. **Add rate limiting** to prevent abuse
3. **Use HTTPS** (Netlify provides this automatically)
4. **Validate and sanitize all input data**

### Scaling

1. **Consider using Netlify's database add-ons** or external database services
2. **Implement caching** for frequently accessed data
3. **Monitor function execution time** to avoid timeouts

## Testing the Deployment

1. After deployment, test all API endpoints
2. Verify authentication works correctly
3. Test ticket CRUD operations
4. Check error handling and validation

## Troubleshooting

### Common Issues

1. **Function not found**: Ensure `netlify.toml` is configured correctly
2. **CORS errors**: Check that CORS headers are set in functions
3. **Authentication failures**: Verify token handling in both frontend and backend
4. **Database errors**: Check file permissions and paths in functions

### Debugging

1. Check Netlify function logs in the dashboard
2. Use browser developer tools to inspect network requests
3. Test functions locally using `netlify dev` command

## Additional Resources

- [Netlify Functions Documentation](https://docs.netlify.com/edge-functions/overview/)
- [Vue.js Documentation](https://vuejs.org/guide/)
- [Axios Documentation](https://axios-http.com/docs/intro)
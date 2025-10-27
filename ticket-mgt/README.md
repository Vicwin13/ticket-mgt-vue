# Ticket Management System with Netlify Functions

A full-stack Vue.js ticket management application with serverless backend using Netlify Functions. This system allows users to create, read, update, and delete tickets with user authentication.

## Features

- 🔐 User authentication (login/register)
- 🎫 Full CRUD operations for tickets
- 🔍 Search and filter functionality
- 📱 Responsive design
- 🚀 Serverless backend with Netlify Functions
- 💾 Persistent data storage

## Tech Stack

- **Frontend**: Vue 3, Vite, Vue Router, Vue Toastification
- **Backend**: Netlify Functions (serverless)
- **Database**: JSON file storage (for simplicity)
- **Styling**: Custom CSS
- **HTTP Client**: Axios

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
│   │   ├── Login.vue
│   │   ├── Signup.vue
│   │   ├── TicketMgt.vue
│   │   └── ...
│   ├── data/
│   │   └── db.json         # Database file
│   └── ...
├── netlify.toml           # Netlify configuration
├── dev-server.cjs         # Development server
└── package.json           # Project dependencies
```

## Quick Start

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ticket-mgt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To run the application in development mode with both frontend and backend:

```bash
npm run dev
```

This will start:
- Frontend development server at `http://localhost:5173` (or next available port)
- API development server at `http://localhost:3002`

### Separate Development

If you prefer to run frontend and backend separately:

```bash
# Start only the frontend
npm run dev:vite

# Start only the API server
npm run dev-server
```

### Production Build

```bash
npm run build
```

This creates a production-ready build in the `dist` directory.

## API Documentation

### Base URL
- Development: `http://localhost:3002/api`
- Production: `https://your-domain.netlify.app/api`

### Authentication

All ticket operations (except GET all tickets) require authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

### Endpoints

#### User Authentication

**POST /api/users**
Login with email and password

Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "id": "1",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com"
  },
  "token": "mocked-jwt-1-1234567890"
}
```

**POST /api/users/register**
Register a new user

Request Body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "id": "2",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  },
  "token": "mocked-jwt-2-1234567890"
}
```

#### Ticket Management

**GET /api/tickets**
Get all tickets (no authentication required)

Response:
```json
[
  {
    "id": "1",
    "title": "Sample Ticket",
    "description": "This is a sample ticket",
    "status": "open",
    "priority": "medium",
    "createdAt": "2023-11-14T14:20:00.000Z",
    "updatedAt": "2023-11-15T09:15:00.000Z"
  }
]
```

**POST /api/tickets**
Create a new ticket (authentication required)

Request Body:
```json
{
  "title": "New Ticket",
  "description": "Description of the new ticket",
  "status": "open",
  "priority": "high"
}
```

Response:
```json
{
  "id": "3",
  "title": "New Ticket",
  "description": "Description of the new ticket",
  "status": "open",
  "priority": "high",
  "createdAt": "2023-11-16T10:30:00.000Z",
  "updatedAt": "2023-11-16T10:30:00.000Z"
}
```

**PUT /api/tickets/:id**
Update an existing ticket (authentication required)

Request Body:
```json
{
  "title": "Updated Ticket",
  "description": "Updated description",
  "status": "in-progress",
  "priority": "medium"
}
```

**DELETE /api/tickets/:id**
Delete a ticket (authentication required)

Response:
```json
{
  "id": "3",
  "title": "Deleted Ticket",
  "description": "This ticket was deleted",
  "status": "closed",
  "priority": "low",
  "createdAt": "2023-11-16T10:30:00.000Z",
  "updatedAt": "2023-11-16T11:00:00.000Z"
}
```

## Deployment to Netlify

### Prerequisites

- Netlify account
- Git repository (GitHub, GitLab, or Bitbucket)

### Steps

1. **Push to Git Repository**
   ```bash
   git add .
   git commit -m "Add Netlify Functions backend"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

4. **Environment Variables** (if needed)
   - Add any environment variables in Netlify dashboard under Site settings > Build & deploy > Environment

5. **Deploy**
   - Netlify will automatically build and deploy your site
   - Your functions will be available at `/.netlify/functions/api`

### Testing Production

After deployment:
1. Test all API endpoints
2. Verify authentication flow
3. Check ticket CRUD operations
4. Test error handling

## Development Workflow

### Adding New Features

1. **Frontend Changes**
   - Modify Vue components in `src/components/`
   - Update routes in `src/router/`
   - Add styles in component files or global CSS

2. **Backend Changes**
   - Modify Netlify Functions in `netlify/functions/`
   - Update API endpoints in `api.js`
   - Test with `curl` or Postman

3. **Database Changes**
   - For simple changes, modify `src/data/db.json`
   - For production, consider external database

### Testing API Endpoints

Use `curl` to test endpoints:

```bash
# Get all tickets
curl -X GET http://localhost:3002/api/tickets

# Login
curl -X POST http://localhost:3002/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Create ticket (with token)
curl -X POST http://localhost:3002/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"title":"Test Ticket","description":"Test description"}'
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Production Considerations

### Security

- The current implementation uses simple token-based authentication
- For production, consider:
  - Proper JWT implementation with expiration
  - Rate limiting
  - Input validation and sanitization
  - HTTPS (provided by Netlify)

### Database

- Current implementation uses JSON file storage
- For production, consider:
  - External database (MongoDB, PostgreSQL, etc.)
  - Database connection pooling
  - Data backup strategies

### Scaling

- Netlify Functions automatically scale with demand
- Consider:
  - Monitoring function execution time
  - Implementing caching for frequent requests
  - Using Netlify's database add-ons

## Troubleshooting

### Common Issues

1. **Function not found**: Ensure `netlify.toml` is configured correctly
2. **CORS errors**: Check that CORS headers are set in functions
3. **Authentication failures**: Verify token handling in both frontend and backend
4. **Database errors**: Check file permissions and paths in functions

### Debugging

1. Check Netlify function logs in dashboard
2. Use browser developer tools to inspect network requests
3. Test functions locally using `netlify dev` command

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

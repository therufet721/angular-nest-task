# Fullstack NestJS + Angular Application

A full-stack application with user authentication (JWT), protected routes, and paginated items with MongoDB Atlas.

## Project Structure

```
├── backend/          # NestJS API
│   ├── src/
│   │   ├── auth/     # Authentication module (login, register, JWT)
│   │   ├── users/    # Users module with Mongoose schema
│   │   ├── items/    # Items module with pagination
│   │   ├── health/   # Health check endpoint
│   │   └── common/   # Shared DTOs, middleware, utils (sanitization)
│   └── ...
├── frontend/         # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/     # Services, guards, interceptors
│   │   │   ├── auth/     # Login/Register components
│   │   │   └── items/    # Items page with pagination
│   │   └── environments/
│   └── ...
└── README.md
```

## Features

### Backend (NestJS)
- ✅ MongoDB Atlas connection with Mongoose
- ✅ User registration with bcrypt password hashing
- ✅ JWT-based authentication
- ✅ Token validation endpoint
- ✅ Protected routes with JWT guards
- ✅ Paginated items endpoint using mongoose-paginate-v2
- ✅ ObjectId reference population (Category -> Item)
- ✅ Auto-seeding of mock data

### Security Features
- ✅ Helmet middleware for HTTP security headers
- ✅ Rate limiting (100 requests per minute per IP)
- ✅ Password complexity validation (uppercase, lowercase, number required)
- ✅ Input validation with class-validator
- ✅ Input sanitization (XSS protection, HTML escaping)
- ✅ Pagination limit validation (max 100 items)
- ✅ Health check endpoint for monitoring

### Frontend (Angular)
- ✅ Clean folder structure (core, auth, items)
- ✅ Environment configuration
- ✅ Login and Register pages with validation
- ✅ JWT token storage in localStorage
- ✅ HTTP Interceptor for automatic token injection
- ✅ Auth Guard for protected routes
- ✅ JWT validation on protected route access
- ✅ Items page with pagination controls
- ✅ Page size selector
- ✅ Logout functionality
- ✅ Loading states
- ✅ Error handling and display
- ✅ Modern, responsive UI

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB Atlas account (free tier available)

## Setup Instructions

### 1. MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier M0 is sufficient)
3. Create a database user with read/write access
4. Add your IP address to the network access whitelist (or allow access from anywhere: 0.0.0.0/0)
5. Get your connection string from "Connect" -> "Connect your application"

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your MongoDB connection string
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
# JWT_SECRET=your-super-secret-jwt-key
# JWT_EXPIRES_IN=1d

# Start the development server
npm run start:dev
```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
ng serve
# or
npm start
```

The frontend will run on `http://localhost:4200`

## Environment Configuration

### Backend (.env)

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=86400
CORS_ORIGIN=http://localhost:4200
PORT=3000
```

> **Note:** `JWT_EXPIRES_IN` is in seconds (86400 = 1 day)

### Frontend (src/environments/environment.ts)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and get JWT token | No |
| GET | `/auth/validate` | Validate JWT and get user info | Yes |

### Items

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/items` | Get paginated items (max 100 per page) | Yes |

### Health

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check endpoint | No |

#### Request Examples

**Register:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"login": "testuser", "password": "Password123"}'
```

> **Note:** Password must be at least 8 characters and contain uppercase, lowercase, and a number.

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login": "testuser", "password": "Password123"}'
```

**Validate Token:**
```bash
curl -X GET http://localhost:3000/auth/validate \
  -H "Authorization: Bearer <your-jwt-token>"
```

**Get Items (with pagination):**
```bash
curl -X GET "http://localhost:3000/items?page=1&limit=10" \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Using JWT in Headers

All protected routes require the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The Angular frontend automatically handles this through the HTTP Interceptor.

## Mock Data

The backend automatically seeds mock data on first startup:

- **5 Categories:** Electronics, Books, Clothing, Home & Garden, Sports
- **25 Items:** Various products with prices, quantities, and category references

## Testing the Application

1. Start both backend and frontend servers
2. Open `http://localhost:4200` in your browser
3. Register a new account
4. Login with your credentials
5. Browse the paginated items list
6. Use pagination controls to navigate
7. Change page size using the dropdown
8. Click "Logout" to end session

## Project Technologies

### Backend
- NestJS 11
- MongoDB with Mongoose
- Passport JWT
- bcrypt
- class-validator
- mongoose-paginate-v2
- Helmet (security headers)
- @nestjs/throttler (rate limiting)

### Frontend
- Angular 21
- Angular Router
- HttpClient with Interceptors
- Signals for state management
- SCSS for styling

## Security Considerations

This application implements several security best practices:

1. **Password Security**
   - Bcrypt hashing with salt rounds
   - Password complexity requirements (min 8 chars, uppercase, lowercase, number)

2. **HTTP Security Headers** (Helmet)
   - X-Content-Type-Options
   - X-Frame-Options
   - X-XSS-Protection
   - And more...

3. **Rate Limiting**
   - 100 requests per minute per IP
   - Prevents brute force and DDoS attacks

4. **Input Validation & Sanitization**
   - All DTOs validated with class-validator
   - Whitelist mode strips unknown properties
   - Pagination limits enforced (max 100 items)
   - Input sanitization (trim whitespace, escape HTML)
   - XSS protection via HTML entity encoding

5. **JWT Security**
   - Tokens expire after configured time (default: 1 day)
   - Secret key should be set via environment variable

### Production Recommendations

For production deployment, ensure:
- Set a strong, unique `JWT_SECRET` in environment variables
- Configure `CORS_ORIGIN` to your frontend domain
- Use HTTPS for all communications
- Consider using httpOnly cookies for token storage

## License

MIT

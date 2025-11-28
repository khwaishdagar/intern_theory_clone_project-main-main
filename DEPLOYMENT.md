# Deployment Guide - InternTheory Authentication System

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `bcryptjs` - For password hashing
- `jsonwebtoken` - For JWT token generation
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables

### 2. Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
MONGODB_URI=your_mongodb_connection_string
```

### 3. Start Backend Server

```bash
# Development mode (with nodemon)
npm start

# Or production mode
node index.js
```

The backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Update API Base URL

In `script/auth.js`, update the `API_BASE_URL`:

```javascript
const API_BASE_URL = "http://localhost:5000/api/auth";
```

For production, change to your deployed backend URL:
```javascript
const API_BASE_URL = "https://your-backend-url.com/api/auth";
```

### 2. Serve Frontend

You can use any static file server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000

# Using VS Code Live Server extension
```

## API Endpoints

### Register User
- **POST** `/api/auth/register`
- **Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "mobile": "1234567890",
  "userType": "student",
  "city": "Mumbai",
  "qualification": "B.Tech"
}
```

### Login User
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User (Protected)
- **GET** `/api/auth/me`
- **Headers:**
```
Authorization: Bearer <token>
```

## Pages

- **Login:** `login.html`
- **Register:** `register.html`
- **Home:** `index.html`

## Authentication Flow

1. User registers/login → Token stored in `localStorage`
2. Token sent with every protected API request
3. Token validated on backend
4. User data stored in `localStorage` for quick access

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Token expiration (7 days)
- ✅ Protected routes
- ✅ Input validation

## Deployment Options

### Backend (Node.js)
- **Heroku**
- **Vercel** (Serverless)
- **Railway**
- **Render**
- **AWS EC2**

### Frontend (Static)
- **Vercel**
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

## Testing

1. Register a new user at `/register.html`
2. Login at `/login.html`
3. Check `localStorage` for token and user data
4. Test protected routes with token

## Troubleshooting

### CORS Issues
Make sure backend has CORS enabled and allows your frontend origin.

### Token Not Working
- Check if token is being sent in Authorization header
- Verify JWT_SECRET matches in backend
- Check token expiration

### Database Connection
- Verify MongoDB connection string
- Check network access to MongoDB


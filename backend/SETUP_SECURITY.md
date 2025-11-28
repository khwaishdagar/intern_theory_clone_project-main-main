# Security Setup Guide

## Quick Start

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

This will install:
- `express-rate-limit` - For API rate limiting
- `winston` - For logging

### Step 2: Create .env File

Create a `.env` file in the `backend` directory with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
# Replace with your actual MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT Configuration
# IMPORTANT: Change this to a strong random string in production
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging Configuration
LOG_LEVEL=info
```

**Important:** 
- Copy `.env.example` to `.env` if it exists
- Replace `MONGODB_URI` with your actual MongoDB connection string
- Generate a strong random string for `JWT_SECRET` (you can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

### Step 3: Start the Server
```bash
npm start
```

The server will:
- ✅ Validate environment variables
- ✅ Connect to MongoDB
- ✅ Start logging system
- ✅ Apply rate limiting
- ✅ Enable error handling

### Optional: Built-in In-Memory MongoDB (for local development)

If you don't have MongoDB installed locally, the backend now ships with an automatic fallback using `mongodb-memory-server`.

- By default, the fallback kicks in whenever the primary `MONGODB_URI` is missing or unreachable.
- Data stored in the in-memory instance is ephemeral and will be cleared every time you restart the backend.
- To disable this helper (for example, in production), set `ENABLE_INMEMORY_MONGO=false` in your `.env`.
- You can customise the temporary database name by setting `MONGO_INMEMORY_DBNAME` (defaults to `intern_theory_inmemory`).

## What's New?

### 🔒 Security Features Added:

1. **Environment Variables** - All sensitive data moved to `.env`
2. **Input Validation** - Request validation middleware
3. **Error Handling** - Centralized error handling
4. **Rate Limiting** - Protection against abuse
5. **Logging** - Comprehensive logging system

### 📁 New Files Created:

- `backend/src/middleware/validation.js` - Input validation
- `backend/src/middleware/errorHandler.js` - Error handling
- `backend/src/middleware/rateLimiter.js` - Rate limiting
- `backend/src/utils/logger.js` - Logging utility
- `backend/.env.example` - Environment template
- `backend/.gitignore` - Updated to exclude .env
- `backend/logs/` - Log files directory (auto-created)

### 🔄 Updated Files:

- `backend/index.js` - Added all middlewares
- `backend/src/configs/db.js` - Uses environment variables
- `backend/src/controllers/auth.controller.js` - Added validation & logging
- `backend/package.json` - New dependencies

## Verification

After starting the server, you should see:

```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📝 Environment: development
🌐 API URL: http://localhost:5000
```

## Testing

### Test Registration (with validation):
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "mobile": "1234567890",
    "userType": "student"
  }'
```

### Test Rate Limiting:
Try making more than 5 login requests in 15 minutes - you should get rate limited.

### Check Logs:
Logs are stored in `backend/logs/`:
- `error.log` - Error logs only
- `combined.log` - All logs

## Troubleshooting

### Error: "MONGODB_URI is not defined"
- Make sure `.env` file exists in `backend/` directory
- Check that `MONGODB_URI` is set in `.env`

### Error: "JWT_SECRET is not defined"
- Make sure `JWT_SECRET` is set in `.env`
- Generate a new secret if needed

### Rate Limiting Too Strict?
- Adjust `RATE_LIMIT_MAX_REQUESTS` in `.env`
- Adjust `RATE_LIMIT_WINDOW_MS` for time window

### Logs Not Appearing?
- Check `backend/logs/` directory exists
- Check `LOG_LEVEL` in `.env` (try "debug" for more logs)

## Production Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Update `MONGODB_URI` with production database
- [ ] Review and adjust rate limits
- [ ] Set up log rotation
- [ ] Configure CORS properly (set `FRONTEND_URL`)
- [ ] Enable HTTPS
- [ ] Review error messages (remove stack traces in production)

## Support

For detailed documentation, see `README_SECURITY.md`


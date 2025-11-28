# Security Improvements Documentation

This document outlines the security improvements made to the InternTheory backend.

## 🔒 Security Features Implemented

### 1. Environment Variables (.env)
- ✅ All sensitive configuration moved to `.env` file
- ✅ `.env` added to `.gitignore` to prevent accidental commits
- ✅ `.env.example` created as a template
- ✅ Required environment variables validated on startup

**Required Environment Variables:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### 2. Input Validation Middleware
- ✅ Request body validation for registration
- ✅ Request body validation for login
- ✅ MongoDB ID validation
- ✅ Input sanitization (trim whitespace)
- ✅ Email format validation
- ✅ Password strength validation
- ✅ Mobile number format validation

**Location:** `backend/src/middleware/validation.js`

### 3. Error Handling Middleware
- ✅ Centralized error handling
- ✅ Consistent error response format
- ✅ Proper HTTP status codes
- ✅ Error logging
- ✅ 404 handler for unknown routes
- ✅ Async handler wrapper to catch promise rejections

**Location:** `backend/src/middleware/errorHandler.js`

### 4. Rate Limiting
- ✅ General API rate limiting (100 requests per 15 minutes)
- ✅ Strict rate limiting for authentication (5 attempts per 15 minutes)
- ✅ Strict rate limiting for registration (3 attempts per hour)
- ✅ IP-based rate limiting
- ✅ Skip successful requests for auth limiter

**Location:** `backend/src/middleware/rateLimiter.js`

### 5. Logging System
- ✅ Winston logger implementation
- ✅ Log levels (error, warn, info, debug)
- ✅ File-based logging (error.log, combined.log)
- ✅ Console logging for development
- ✅ Request logging middleware
- ✅ Error logging with stack traces

**Location:** `backend/src/utils/logger.js`

### 6. Database Security
- ✅ MongoDB connection string moved to environment variables
- ✅ Connection error handling
- ✅ Connection validation on startup

## 📁 File Structure

```
backend/
├── .env                    # Environment variables (not in git)
├── .env.example           # Template for environment variables
├── .gitignore             # Updated to exclude .env
├── src/
│   ├── middleware/
│   │   ├── validation.js      # Input validation
│   │   ├── errorHandler.js    # Error handling
│   │   └── rateLimiter.js     # Rate limiting
│   ├── utils/
│   │   └── logger.js         # Logging utility
│   ├── configs/
│   │   └── db.js            # Database config (updated)
│   └── controllers/
│       └── auth.controller.js # Updated with validation
└── logs/                   # Log files directory
    ├── error.log
    └── combined.log
```

## 🚀 Setup Instructions

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create .env File:**
   ```bash
   cp .env.example .env
   ```

3. **Update .env with your values:**
   - Set `MONGODB_URI` with your MongoDB connection string
   - Set `JWT_SECRET` to a strong random string
   - Adjust other settings as needed

4. **Start Server:**
   ```bash
   npm start
   ```

## 🔍 Validation Rules

### Registration:
- First name: Required, min 2 characters
- Last name: Required, min 2 characters
- Email: Required, valid email format
- Password: Required, min 6 characters
- Mobile: Required, 10 digits
- User type: Required, must be "student" or "company"

### Login:
- Email: Required, valid email format
- Password: Required

## 📊 Rate Limits

- **General API:** 100 requests per 15 minutes per IP
- **Login:** 5 attempts per 15 minutes per IP
- **Registration:** 3 attempts per hour per IP

## 📝 Logging

Logs are stored in `backend/logs/`:
- `error.log`: Only error level logs
- `combined.log`: All logs

Log levels:
- `error`: Error messages
- `warn`: Warning messages
- `info`: Informational messages
- `debug`: Debug messages (development only)

## ⚠️ Important Notes

1. **Never commit `.env` file** - It contains sensitive information
2. **Change JWT_SECRET** - Use a strong random string in production
3. **Update MongoDB URI** - Use your actual MongoDB connection string
4. **Review rate limits** - Adjust based on your application needs
5. **Monitor logs** - Check logs regularly for security issues

## 🛡️ Security Best Practices

1. ✅ Environment variables for sensitive data
2. ✅ Input validation and sanitization
3. ✅ Rate limiting to prevent abuse
4. ✅ Proper error handling (no sensitive data in errors)
5. ✅ Logging for security monitoring
6. ✅ JWT token expiration
7. ✅ Password hashing (bcrypt)

## 🔄 Migration Notes

If you're updating an existing installation:

1. Create `.env` file with your current values
2. Update `db.js` - it now requires `MONGODB_URI` from env
3. Update `auth.controller.js` - validation middleware added
4. Install new dependencies: `npm install express-rate-limit winston`
5. Restart server

## 📞 Support

For issues or questions, check:
- Error logs in `backend/logs/error.log`
- Console output for startup errors
- Environment variables are set correctly


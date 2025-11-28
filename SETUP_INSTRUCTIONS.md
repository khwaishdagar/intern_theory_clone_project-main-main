# Setup Instructions - Dynamic Landing Page & Authentication

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 2: Start Backend Server

```bash
cd backend
npm start
```

Backend will run on `http://localhost:5000`

> 💡 **No MongoDB installed locally?**  
> The backend now falls back to an embedded MongoDB instance (via `mongodb-memory-server`) whenever it cannot reach the URI defined in `.env`. This means you can prototype immediately, but remember that any data stored while using the in-memory database is temporary and disappears after a restart.  
> Set `ENABLE_INMEMORY_MONGO=false` if you prefer to fail fast instead of using the fallback.

## Step 3: Seed Initial Data

Once backend is running, seed the database with initial landing page data:

**Using Browser:**
```
POST http://localhost:5000/api/seed/seed
```

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/seed/seed
```

**Using Postman/Thunder Client:**
- Method: POST
- URL: `http://localhost:5000/api/seed/seed`
- Send request

This will create:
- Hero section data
- Eligibility criteria
- Benefits
- Political figures
- Features
- Opportunities
- Carousel slides
- Images

## Step 4: Update API URLs (if needed)

If your backend is on a different port or domain, update:

1. `script/auth.js` - Line 2: `API_BASE_URL`
2. `script/api.js` - Line 2: `API_BASE_URL`

## Step 5: Start Frontend Server

**Option 1: VS Code Live Server**
- Right-click `index.html`
- Select "Open with Live Server"

**Option 2: Node.js http-server**
```bash
npx http-server -p 8000
```

**Option 3: Python (if installed)**
```bash
python -m http.server 8000
```

## Step 6: Test the Application

1. Open `http://localhost:8000/index.html`
2. Landing page should load with data from backend
3. Click REGISTER button → Should go to register page
4. Click LOGIN button → Should go to login page
5. Register a new user
6. Login with credentials

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Landing Page
- `GET /api/landing` - Get all landing page data
- `GET /api/landing/sections` - Get all sections
- `GET /api/landing/sections/:type` - Get specific section
- `POST /api/landing/sections` - Create/Update section
- `GET /api/landing/images` - Get images
- `POST /api/landing/images` - Upload image

### Content
- `GET /api/content/register` - Get register page content
- `GET /api/content/login` - Get login page content

### Seed
- `POST /api/seed/seed` - Seed initial data

## Troubleshooting

### Backend not connecting
- Check if backend is running on port 5000
- Verify MongoDB connection in `backend/src/configs/db.js`
- Check console for errors

### Frontend not loading data
- Open browser console (F12)
- Check for CORS errors
- Verify API_BASE_URL is correct
- Check Network tab for failed requests

### Images not loading
- Verify image URLs in database
- Check if URLs are accessible
- Update image URLs via API if needed

## Database Structure

### Landing Page Sections
- `sectionType`: hero, eligibility, benefits, political_figures, features, opportunities, carousel
- `content`: Flexible JSON structure
- `imageUrl`: URL to section image
- `order`: Display order
- `isActive`: Show/hide section

### Images
- `name`: Image name
- `url`: Image URL
- `category`: hero, feature, testimonial, logo, icon, banner, other
- `page`: landing, register, login, etc.
- `isActive`: Show/hide image


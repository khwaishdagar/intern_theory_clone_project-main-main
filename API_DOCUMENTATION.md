# API Documentation - InternTheory

## Base URL
```
http://localhost:5000/api
```

## Authentication APIs

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

### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`

## Landing Page APIs

### Get All Landing Page Data
- **GET** `/api/landing`
- Returns all sections and images

### Get All Sections
- **GET** `/api/landing/sections`
- Returns all active sections ordered by `order` field

### Get Section by Type
- **GET** `/api/landing/sections/:type`
- Types: `hero`, `eligibility`, `benefits`, `political_figures`, `features`, `opportunities`, `carousel`

### Create/Update Section
- **POST** `/api/landing/sections`
- **Body:**
```json
{
  "sectionType": "hero",
  "title": "Hero Section",
  "content": {
    "acceptedText": "Accepted the Offer",
    "heroQuestion": "But not Joined yet?",
    "orangeBoxText": "Don't worry - the window is still open!",
    "description": "Reach out to the company...",
    "buttonText": "Reach Out Now"
  },
  "imageUrl": "https://example.com/image.jpg",
  "order": 1
}
```

### Get Images
- **GET** `/api/landing/images?category=hero&page=landing`
- Query params: `category` (optional), `page` (optional)

### Upload Image
- **POST** `/api/landing/images`
- **Body:**
```json
{
  "name": "Hero Image",
  "url": "https://example.com/image.jpg",
  "alt": "Description",
  "category": "hero",
  "page": "landing"
}
```

## Content APIs

### Get Register Page Content
- **GET** `/api/content/register`
- Returns register page configuration

### Get Login Page Content
- **GET** `/api/content/login`
- Returns login page configuration

## Seed Data

### Seed Initial Data
- **POST** `/api/seed/seed`
- Creates initial landing page data and images
- Run this once to populate database

## Example Usage

### Seed Data First
```bash
POST http://localhost:5000/api/seed/seed
```

### Fetch Landing Page
```javascript
const response = await fetch('http://localhost:5000/api/landing');
const data = await response.json();
// data.sections - array of sections
// data.images - array of images
```

### Update Hero Section
```javascript
await fetch('http://localhost:5000/api/landing/sections', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sectionType: 'hero',
    content: {
      heroQuestion: 'New Question?',
      // ... other fields
    }
  })
});
```


# BlogHub - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Folder Structure](#folder-structure)
3. [Technology Stack](#technology-stack)
4. [Installation & Setup](#installation--setup)
5. [Running Locally](#running-locally)
6. [Deployment](#deployment)
7. [API Reference](#api-reference)
8. [Frontend Guide](#frontend-guide)
9. [Admin Panel Guide](#admin-panel-guide)
10. [Database & Storage](#database--storage)
11. [Troubleshooting](#troubleshooting)
12. [Environment Variables](#environment-variables)

---

## Project Overview

**BlogHub** is a complete blog management platform with:
- 📝 **Admin Panel** - Create, edit, delete blogs with rich text editor
- 👁️ **Frontend** - Beautiful, responsive blog viewer with filtering & search
- 🗄️ **Backend** - Node.js REST API with Supabase integration
- 📱 **Responsive** - Works on desktop, tablet, and mobile

### Key Features
- ✅ Secure login system (admin/admin123)
- ✅ Rich text editor with formatting options
- ✅ Image upload support
- ✅ Category-based filtering
- ✅ Search functionality
- ✅ View count tracking
- ✅ CORS enabled for cross-origin requests

---

## Folder Structure

```
GLI/
│
├── backend/                      # Node.js Express Server
│   ├── .env                      # Environment variables (DO NOT COMMIT)
│   ├── .env.example              # Template for environment variables
│   ├── .gitignore                # Git ignore rules
│   ├── package.json              # Dependencies & scripts
│   ├── server.js                 # Main server file
│   ├── node_modules/             # Installed packages
│   │
│   ├── data/                     # Data storage (JSON files)
│   │   ├── blogs.json            # Blog posts
│   │   ├── users.json            # User credentials
│   │   └── sample-blogs.json      # Sample data
│   │
│   └── public/                   # Static files
│       └── uploads/              # Upload directory for images
│
├── frontend/                     # Static HTML/CSS/JavaScript
│   ├── index.html                # Main blog viewer page
│   ├── admin.html                # Admin panel page
│   ├── blog-script.js            # Blog viewer logic
│   ├── admin-script.js           # Admin panel logic
│   ├── blog-styles.css           # Blog page styling
│   ├── admin-styles.css          # Admin panel styling
│   ├── package.json              # Frontend metadata only
│   └── node_modules/             # Minimal dependencies (nodemon only)
│
├── README.md                     # Main readme
├── QUICK_START.md                # 5-minute setup guide
├── INSTALLATION.md               # Detailed installation
├── PROJECT_OVERVIEW.md           # Project features
├── FEATURE_VERIFICATION.md       # Feature checklist
├── START_HERE.md                 # Quick reference
└── DOCUMENTATION.md              # This file
```

---

## Technology Stack

### Backend
- **Runtime:** Node.js (v14+)
- **Framework:** Express.js 4.18.2
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Simple credentials-based
- **File Upload:** Multer
- **CORS:** Enabled for all origins
- **Body Parser:** For JSON/URL-encoded data

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Flexbox, Grid, animations
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **HTTP Client:** Fetch API
- **Editor:** Custom rich text editor

### Deployment
- **Backend:** Render.com (Node.js service)
- **Frontend:** Vercel / Netlify / Render (static site)
- **Database:** Supabase Cloud

---

## Installation & Setup

### Prerequisites
- Node.js v14 or higher
- npm (comes with Node.js)
- Git
- Modern web browser

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/GLI.git
cd GLI
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in `backend/`:
```
SUPABASE_URL=https://ehcpirxufdkrdjgoioxm.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoY3Bpcnh1ZmRrcmRqZ29pb3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMTY3MjMsImV4cCI6MjA5Mzg5MjcyM30.PCCLvXjyy95oLJFQCbIRwJPdrwNx7cV1RfqHrwbYJzc
PORT=5000
```

### Step 3: Frontend Setup
No installation needed - it's static HTML/CSS/JS! But update API URL if needed:

In `frontend/blog-script.js` (line 1):
```javascript
const API_URL = 'https://your-backend-url/api';
```

In `frontend/admin-script.js` (line 1):
```javascript
const API_URL = 'https://your-backend-url/api';
```

---

## Running Locally

### Terminal 1: Start Backend
```bash
cd backend
npm start
```
✅ Server runs on: `http://localhost:5000`

### Terminal 2: Start Frontend
Choose ONE option:

**Option A: Python HTTP Server (Easiest)**
```bash
cd frontend
python -m http.server 8000
```
Open: `http://localhost:8000`

**Option B: Node HTTP Server**
```bash
cd frontend
npx http-server
```

**Option C: VS Code Live Server**
1. Right-click `frontend/index.html`
2. Select "Open with Live Server"

### Access Application
- **Blog Viewer:** http://localhost:8000
- **Admin Panel:** http://localhost:8000/admin.html
- **Login:** admin / admin123

---

## Deployment

### Backend Deployment (Render)

**Current URL:** https://bloghub-o4he.onrender.com

1. Sign up at [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - Name: `blog-hub-backend`
   - Runtime: `Node`
   - Build: `npm install`
   - Start: `npm start`
   - Root Directory: `backend/`
5. Add Environment Variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `PORT` (optional, defaults to 5000)

### Frontend Deployment (Vercel)

**Current URL:** https://blog-hub-sandy.vercel.app

1. Sign up at [vercel.com](https://vercel.com)
2. Create new project from GitHub
3. Configure:
   - Root Directory: `frontend/`
   - Build Command: (leave empty)
   - Output Directory: `.`
4. Deploy

### Manual Frontend Deploy
```bash
npm install -g vercel
vercel --cwd=frontend
```

---

## API Reference

### Base URL
```
https://bloghub-o4he.onrender.com/api
```

### Endpoints

#### 1. Authentication
**Login User**
```http
POST /login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "success": true,
  "message": "Login successful"
}
```

#### 2. Blogs

**Get All Blogs**
```http
GET /blogs
Response: [{ id, title, content, category, featured_image, author, views, created_at }]
```

**Get Single Blog**
```http
GET /blogs/:id
Response: { id, title, content, category, featured_image, author, views, created_at }
```

**Create Blog** (Requires login)
```http
POST /blogs
Content-Type: application/json

{
  "title": "Blog Title",
  "content": "<h2>Content</h2>",
  "category": "Latest Jobs",
  "featured_image": "https://url.com/image.jpg",
  "author": "Admin"
}

Response: { id, title, ... }
```

**Update Blog** (Requires login)
```http
PUT /blogs/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "category": "News",
  "featured_image": "https://url.com/new-image.jpg"
}

Response: { id, title, ... }
```

**Delete Blog** (Requires login)
```http
DELETE /blogs/:id
Response: { success: true, message: "Blog deleted" }
```

#### 3. Search
**Search Blogs**
```http
GET /search?query=keyword
Response: [{ matching blogs }]
```

#### 4. View Count
**Increment View Count**
```http
PUT /blogs/:id/view
Response: { views: number }
```

---

## Frontend Guide

### Pages

#### 1. **Blog Viewer** (`index.html`)
**Features:**
- Display all blogs in card layout
- Filter by category
- Search by title/content
- Click blog card to read full post
- Share options (Facebook, Twitter, Email)
- View count display
- Comment section
- Contact information

**File Structure:**
- `index.html` - HTML markup
- `blog-styles.css` - Styling
- `blog-script.js` - JavaScript logic

**Key Functions in `blog-script.js`:**
```javascript
loadBlogs()           // Fetch all blogs from API
filterBlogs(cat)      // Filter by category
searchBlogs()         // Search functionality
openBlogModal(blog)   // Show full blog view
closeBlogModal()      // Close modal
incrementViewCount()  // Track views
```

#### 2. **Admin Panel** (`admin.html`)
**Features:**
- Login with admin credentials
- Create new blogs
- Edit existing blogs
- Delete blogs with confirmation
- Rich text editor
- Image upload
- Category selection
- View statistics

**File Structure:**
- `admin.html` - HTML markup
- `admin-styles.css` - Styling
- `admin-script.js` - JavaScript logic

**Key Functions in `admin-script.js`:**
```javascript
login()              // Authenticate user
logout()             // Clear session
loadBlogs()          // Fetch all blogs
createBlog()         // Add new blog
updateBlog()         // Edit blog
deleteBlog(id)       // Remove blog
openBlogModal()      // Show create/edit form
closeBlogModal()     // Close form
```

### Rich Text Editor Features
- **Headings** (H2, H3)
- **Text Formatting** (Bold, Italic, Underline, Code)
- **Lists** (Ordered, Unordered)
- **Tables** (with formatting)
- **Links** (Insert/edit)

---

## Admin Panel Guide

### Login
1. Go to: `https://your-site.com/admin.html`
2. Username: `admin`
3. Password: `admin123`

### Create Blog
1. Click **"+ Create New Blog"**
2. Fill in:
   - **Title** - Blog post title
   - **Content** - Use editor for formatting
   - **Category** - Choose from dropdown
   - **Featured Image** - Upload or paste URL
3. Click **"Create Blog"**

### Edit Blog
1. Click **"Edit"** on any blog card
2. Modify content
3. Click **"Update Blog"**

### Delete Blog
1. Click **"Delete"** button
2. Confirm deletion
3. Blog is removed

### Categories
Available categories:
- Latest Jobs
- Admit Card
- Results
- News
- Updates

---

## Database & Storage

### Supabase Configuration

**Project ID:** `ehcpirxufdkrdjgoioxm`

**Tables:**
- `blogs` - Blog post storage
- `users` - User credentials

**Access:**
- URL: `https://ehcpirxufdkrdjgoioxm.supabase.co`
- Anon Key: See `.env` file

### Data Structure

**Blogs Table:**
```json
{
  "id": 1,
  "title": "Blog Title",
  "content": "<h2>HTML Content</h2>",
  "category": "Latest Jobs",
  "featured_image": "https://image-url.com/img.jpg",
  "author": "Admin",
  "views": 42,
  "created_at": "2026-05-09T10:30:00",
  "updated_at": "2026-05-09T10:30:00"
}
```

**Users Table:**
```json
{
  "id": 1,
  "username": "admin",
  "password": "admin123",
  "email": "admin@blog.com"
}
```

---

## Troubleshooting

### Backend Issues

#### "Port 5000 already in use"
```bash
# Kill the process using port 5000
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

#### "Cannot connect to Supabase"
1. Check `.env` file exists in `backend/`
2. Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
3. Test with: `curl https://your-supabase-url/rest/v1/`

#### "Blogs not loading"
1. Ensure backend is running: `npm start`
2. Check API URL in frontend JS files
3. Verify CORS is enabled
4. Check browser console for errors (F12)

### Frontend Issues

#### "Error loading blogs" message
1. Check if backend is running
2. Verify API URL is correct
3. Check network tab in DevTools (F12)
4. Ensure backend URL doesn't have trailing slash

#### "Images not displaying"
1. Verify image URLs are absolute (start with https://)
2. Check if image URLs are accessible in browser
3. Verify Supabase storage permissions

#### "Login not working"
1. Check admin credentials (admin/admin123)
2. Ensure backend is running on correct port
3. Check browser console for errors
4. Clear browser cache and try again

### Deployment Issues

#### Vercel shows 404
1. Verify `frontend/` is set as root directory
2. Check deployment status in Vercel dashboard
3. Clear cache: Ctrl+Shift+Delete
4. Trigger redeploy in Vercel dashboard

#### Render backend keeps crashing
1. Check build logs in Render dashboard
2. Verify environment variables are set
3. Check backend/server.js for syntax errors
4. Ensure all dependencies are listed in package.json

#### Blogs not appearing after deployment
1. Check API URL in deployed frontend
2. Verify backend URL is reachable
3. Check CORS settings in backend
4. Test API directly: `https://backend-url/api/blogs`

---

## Environment Variables

### Backend (.env)
```bash
# Supabase Configuration
SUPABASE_URL=https://ehcpirxufdkrdjgoioxm.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here

# Server Port (optional, defaults to 5000)
PORT=5000
```

### Frontend (Hardcoded in JS)
Update in both files:
- `frontend/blog-script.js` (line 1)
- `frontend/admin-script.js` (line 1)

```javascript
const API_URL = 'https://your-backend-url/api';
```

---

## Quick Reference Commands

```bash
# Backend
cd backend
npm install          # Install dependencies
npm start            # Start server (localhost:5000)
npm run dev          # Start with nodemon (auto-reload)

# Frontend
cd frontend
python -m http.server 8000    # Python server
npx http-server               # Node server

# Git
git status           # Check changes
git add .            # Stage changes
git commit -m "msg"  # Commit
git push origin main # Push to GitHub

# Deployment
vercel --cwd=frontend              # Deploy frontend to Vercel
# (Backend deployed via Render dashboard)
```

---

## Support & Resources

### Documentation Files
- `README.md` - Main documentation
- `QUICK_START.md` - 5-minute setup
- `INSTALLATION.md` - Detailed setup
- `PROJECT_OVERVIEW.md` - Features overview
- `FEATURE_VERIFICATION.md` - Feature checklist
- `START_HERE.md` - Quick reference

### Useful Links
- [Express.js Docs](https://expressjs.com)
- [Supabase Docs](https://supabase.com/docs)
- [Render Deployment](https://render.com/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [MDN Web Docs](https://developer.mozilla.org)

---

**Last Updated:** May 9, 2026
**Version:** 1.0.0

# Quick Start Guide

## Get Started in 5 Minutes

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Start Backend Server
```bash
npm start
```
✓ Server running on http://localhost:5000

### Step 3: Start Frontend (Choose One)

#### Option A: Python
```bash
cd frontend
python -m http.server 8000
```
Open: http://localhost:8000

#### Option B: VS Code Live Server
- Right-click `frontend/index.html`
- Select "Open with Live Server"

#### Option C: Direct File (Limited)
- Open `frontend/index.html` in browser

### Step 4: Access the Application

**Frontend (View Blogs)**
- http://localhost:8000 (or your server)

**Admin Panel (Manage Blogs)**
- http://localhost:8000/admin.html
- Login: admin / admin123

## Common Commands

```bash
# Start backend
cd backend && npm start

# Install dependencies
npm install

# Stop server
Ctrl + C

# Check if port is free
netstat -ano | findstr :5000  # Windows
lsof -i :5000                  # Mac/Linux
```

## Features Quick Reference

### Admin Panel
- ✏️ Create blogs with rich text editor
- 📝 Edit existing blogs
- 🗑️ Delete blogs
- 🖼️ Add featured images
- 🏷️ Assign categories
- 📊 View blog statistics

### Blog Viewer
- 📚 View all published blogs
- 🔍 Search by title/content
- 🏷️ Filter by category
- 📱 Fully responsive design
- 👁️ View count tracking

## Default Admin Credentials
- Username: `admin`
- Password: `admin123`

## Database
- Blogs stored in: `backend/data/blogs.json`
- Users stored in: `backend/data/users.json`

## Troubleshooting

### Can't connect to backend?
1. Check if `npm start` is running
2. Verify http://localhost:5000 in browser
3. Check firewall settings

### Frontend not working?
1. Ensure backend is running first
2. Check browser console for errors
3. Try a different browser

### Port already in use?
- Change PORT in `backend/server.js`
- Or kill process using the port

## Next Steps

1. Read full [README.md](README.md) for detailed documentation
2. Customize colors in CSS files
3. Change admin credentials
4. Deploy to production
5. Add more categories as needed

## File Locations

```
backend/
  ├── server.js              (Main backend)
  └── data/
      ├── blogs.json
      └── users.json

frontend/
  ├── index.html             (Blog viewer)
  ├── admin.html             (Admin panel)
  ├── blog-styles.css
  ├── admin-styles.css
  ├── blog-script.js
  └── admin-script.js
```

---

Need help? Check the full [README.md](README.md)

# Blog Management System

A complete blog management platform with admin panel and responsive frontend. This application allows you to create, edit, and manage blogs with a rich text editor, and view them on a responsive frontend with filtering capabilities.

## Features

### Backend (Admin Panel)
- **Authentication**: Secure login system with credentials
- **Blog Management**: Create, edit, and delete blogs
- **Rich Text Editor**: Support for headings, bold, italic, underline, code, lists, and tables
- **Image Support**: Add featured images to blogs
- **Category Management**: Organize blogs by categories (Latest Jobs, Admit Card, Results, News, Updates)
- **REST API**: Full-featured API for blog operations

### Frontend (Blog Viewer)
- **Responsive Design**: Perfect on desktop, tablet, and mobile devices
- **Blog Filtering**: Filter blogs by category
- **Search Functionality**: Search blogs by title and content
- **Blog Details**: Read full blog post with formatted content
- **View Tracking**: Track number of views for each blog
- **Modern UI**: Beautiful and intuitive user interface

## Project Structure

```
GLI/
├── backend/
│   ├── server.js                 # Express server
│   ├── package.json              # Backend dependencies
│   ├── .gitignore
│   └── data/
│       ├── blogs.json           # Blog storage
│       └── users.json           # User data
├── frontend/
│   ├── index.html               # Blog viewer
│   ├── admin.html               # Admin panel
│   ├── blog-styles.css          # Blog page styles
│   ├── admin-styles.css         # Admin panel styles
│   ├── blog-script.js           # Blog viewer script
│   └── admin-script.js          # Admin panel script
└── README.md                     # This file
```

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- A modern web browser

## Installation & Setup

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

Open the frontend files in a web server. You can use any of these methods:

#### Option 1: Using Python (if installed)
```bash
cd frontend
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser

#### Option 2: Using Node.js http-server
```bash
cd frontend
npx http-server
```

#### Option 3: Using VS Code Live Server Extension
1. Right-click on `index.html` in the frontend folder
2. Select "Open with Live Server"

#### Option 4: Direct File Access
Simply open `frontend/index.html` directly in your browser (limited functionality for API calls)

## Usage

### Admin Panel (Blog Management)

1. **Access Admin Panel**: Open `http://localhost:PORT/admin.html` or the appropriate URL
2. **Login**: Use credentials:
   - Username: `admin`
   - Password: `admin123`
3. **Create Blog**:
   - Click "Create Blog" in the sidebar
   - Fill in title, category, and content
   - Use the editor toolbar for formatting (bold, headings, lists, tables)
   - Add a featured image URL or upload one
   - Click "Create Blog"
4. **Edit Blog**:
   - Click "Edit Blog" in the sidebar
   - Select a blog from the dropdown
   - Modify the content
   - Click "Update Blog"
5. **Delete Blog**:
   - Click "Edit Blog" in the sidebar
   - Select a blog
   - Click "Delete Blog" button

### Frontend (Blog Viewer)

1. **View Blogs**: Open `index.html` to see all published blogs
2. **Filter by Category**: Click category buttons on the left sidebar
3. **Search Blogs**: Use the search box to find blogs by title or content
4. **Read Blog**: Click "Read More" on any blog card to view full content
5. **Track Views**: Each blog shows the number of views

## Editor Features

The blog editor includes these formatting options:

- **Headings**: H2 and H3 tags
- **Text Formatting**: Bold, Italic, Underline, Code
- **Lists**: Unordered and Ordered lists
- **Tables**: Insert formatted tables
- **Raw HTML**: You can write HTML directly

Example HTML in editor:
```html
<h2>Main Heading</h2>
<p>This is a paragraph.</p>
<strong>Bold text</strong>
<ul>
  <li>List item 1</li>
  <li>List item 2</li>
</ul>
```

## Default Credentials

- **Username**: admin
- **Password**: admin123

**Note**: Change these credentials in production!

## API Endpoints

### Public Endpoints

- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get single blog
- `GET /api/blogs/category/:category` - Get blogs by category
- `PUT /api/blogs/:id/view` - Increment blog views
- `POST /api/login` - User login

### Protected Endpoints (Require Authentication)

- `POST /api/blogs` - Create new blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
- `POST /api/upload` - Upload image

## Responsive Design

The application is fully responsive and works perfectly on:

- **Desktop**: Full-width layout with sidebar
- **Tablet**: Optimized grid layout
- **Mobile**: Single column layout with touch-friendly buttons

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## File Storage

- **Blogs**: Stored in `backend/data/blogs.json`
- **Users**: Stored in `backend/data/users.json`
- **Uploads**: Stored in `backend/public/uploads/`

## Customization

### Change Admin Credentials

Edit `backend/data/users.json`:
```json
[
  {
    "id": 1,
    "username": "admin",
    "password": "newpassword",
    "email": "admin@blog.com"
  }
]
```

### Customize Categories

Edit both `frontend/admin.html` and `frontend/index.html` to change category options in the select/filter elements.

### Modify Colors

Update the color gradient in CSS files:
- `frontend/admin-styles.css`
- `frontend/blog-styles.css`

Look for `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` to change the theme colors.

## Deployment

For production deployment:

1. **Security**: 
   - Use environment variables for sensitive data
   - Implement proper JWT authentication
   - Hash passwords using bcrypt
   - Use HTTPS

2. **Backend**:
   - Use a production database (MongoDB, PostgreSQL) instead of JSON files
   - Deploy to services like Heroku, AWS, or Azure
   - Add rate limiting and CORS restrictions

3. **Frontend**:
   - Minify and bundle assets
   - Deploy to CDN or static hosting (Vercel, Netlify)
   - Add error tracking (Sentry)

## Troubleshooting

### Backend not responding
- Ensure Node.js is installed
- Run `npm install` in the backend folder
- Check if port 5000 is available
- Make sure `npm start` is running

### Frontend can't connect to backend
- Check if backend server is running
- Ensure CORS is enabled in backend
- Check browser console for errors
- Verify API_URL in JavaScript files

### Images not loading
- Ensure URLs are accessible
- Check file paths in console
- Use absolute URLs instead of relative paths

## Performance Tips

- Optimize images before uploading
- Use lazy loading for better performance
- Implement pagination for large blog lists
- Cache blog data in browser

## Security Considerations

- Always use HTTPS in production
- Validate and sanitize user input
- Use strong passwords
- Implement rate limiting
- Add CSRF protection
- Use prepared statements for database queries

## Future Enhancements

- [ ] User registration and multiple users
- [ ] Comments and ratings on blogs
- [ ] Social media sharing
- [ ] Email notifications
- [ ] Blog drafts
- [ ] Scheduled publishing
- [ ] Analytics dashboard
- [ ] SEO optimization
- [ ] Dark mode theme
- [ ] Multi-language support

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please check:
1. Browser console for errors
2. Backend server logs
3. Network tab in browser developer tools
4. README troubleshooting section

---

**Created for**: Skill Assessment Assignment
**Deadline**: 10 May, 2026

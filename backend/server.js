require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Initialize Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

// File upload setup
const upload = multer({ dest: 'public/uploads' });

// Ensure upload directory exists
if (!fs.existsSync(path.join(__dirname, 'public', 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'public', 'uploads'), { recursive: true });
}

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === 'admin_token_12345') {
      next();
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
};

// API Routes

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password);
    
    if (error) {
      return res.status(401).json({ success: false, message: 'Login failed' });
    }
    
    if (users && users.length > 0) {
      const user = users[0];
      res.json({ 
        success: true, 
        message: 'Login successful',
        token: 'admin_token_12345',
        user: { id: user.id, username: user.username, email: user.email }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(500).json({ message: 'Error fetching blogs' });
    }
    
    res.json(blogs || []);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single blog
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const { data: blog, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', parseInt(req.params.id))
      .single();
    
    if (error) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new blog (authenticated)
app.post('/api/blogs', authenticate, async (req, res) => {
  const { title, content, category, featured_image } = req.body;
  
  if (!title || !content || !category) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  try {
    const { data: newBlog, error } = await supabase
      .from('blogs')
      .insert([{
        title,
        content,
        category,
        featured_image: featured_image || null,
        author: 'Admin',
        views: 0
      }])
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ message: 'Error creating blog' });
    }
    
    res.status(201).json(newBlog[0]);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blog (authenticated)
app.put('/api/blogs/:id', authenticate, async (req, res) => {
  const { title, content, category, featured_image } = req.body;
  const blogId = parseInt(req.params.id);
  
  try {
    const { data: updatedBlog, error } = await supabase
      .from('blogs')
      .update({
        title: title,
        content: content,
        category: category,
        featured_image: featured_image,
        updated_at: new Date().toISOString()
      })
      .eq('id', blogId)
      .select();
    
    if (error) {
      return res.status(500).json({ message: 'Error updating blog' });
    }
    
    if (!updatedBlog || updatedBlog.length === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(updatedBlog[0]);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blog (authenticated)
app.delete('/api/blogs/:id', authenticate, async (req, res) => {
  const blogId = parseInt(req.params.id);
  
  try {
    const { data: deletedBlog, error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', blogId)
      .select();
    
    if (error) {
      return res.status(500).json({ message: 'Error deleting blog' });
    }
    
    if (!deletedBlog || deletedBlog.length === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json({ message: 'Blog deleted successfully', blog: deletedBlog[0] });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload image
app.post('/api/upload', authenticate, upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({ 
      success: true, 
      imageUrl: `/uploads/${req.file.filename}` 
    });
  } else {
    res.status(400).json({ success: false, message: 'No file uploaded' });
  }
});

// Get blogs by category
app.get('/api/category/:category', async (req, res) => {
  try {
    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('category', req.params.category)
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(500).json({ message: 'Error fetching blogs' });
    }
    
    res.json(blogs || []);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Increment views
app.put('/api/blogs/:id/view', async (req, res) => {
  const blogId = parseInt(req.params.id);
  
  try {
    const { data: blog, error: fetchError } = await supabase
      .from('blogs')
      .select('views')
      .eq('id', blogId)
      .single();
    
    if (fetchError) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    const newViews = (blog.views || 0) + 1;
    const { data: updatedBlog, error: updateError } = await supabase
      .from('blogs')
      .update({ views: newViews })
      .eq('id', blogId)
      .select();
    
    if (updateError) {
      return res.status(500).json({ message: 'Error updating views' });
    }
    
    res.json(updatedBlog[0]);
  } catch (error) {
    console.error('Error updating views:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running', database: 'Supabase' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Connected to Supabase: ${SUPABASE_URL}`);
});

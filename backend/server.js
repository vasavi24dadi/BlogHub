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
const SUPABASE_URL = 'https://ehcpirxufdkrdjgoioxm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoY3Bpcnh1ZmRrcmRqZ29pb3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMTY3MjMsImV4cCI6MjA5Mzg5MjcyM30.PCCLvXjyy95oLJFQCbIRwJPdrwNx7cV1RfqHrwbYJzc';

// Initialize Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
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
      return res.status(401).json({
        success: false,
        message: 'Login failed'
      });
    }

    if (users && users.length > 0) {
      const user = users[0];

      res.json({
        success: true,
        token: 'admin_token_12345',
        user
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        message: 'Error fetching blogs'
      });
    }

    res.json(data || []);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }
});

// Get single blog
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(404).json({
        message: 'Blog not found'
      });
    }

    res.json(data);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }
});

// Create blog
app.post('/api/blogs', authenticate, async (req, res) => {
  try {
    const { title, content, category, featured_image } = req.body;

    const { data, error } = await supabase
      .from('blogs')
      .insert([
        {
          title,
          content,
          category,
          featured_image,
          author: 'Admin',
          views: 0
        }
      ])
      .select();

    if (error) {
      return res.status(500).json({
        message: 'Error creating blog'
      });
    }

    res.status(201).json(data[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }
});

// Update blog
app.put('/api/blogs/:id', authenticate, async (req, res) => {
  try {
    const { title, content, category, featured_image } = req.body;

    const { data, error } = await supabase
      .from('blogs')
      .update({
        title,
        content,
        category,
        featured_image
      })
      .eq('id', req.params.id)
      .select();

    if (error) {
      return res.status(500).json({
        message: 'Error updating blog'
      });
    }

    res.json(data[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }
});

// Delete blog
app.delete('/api/blogs/:id', authenticate, async (req, res) => {
  try {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(500).json({
        message: 'Error deleting blog'
      });
    }

    res.json({
      message: 'Blog deleted successfully'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
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
    res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Backend is running',
    database: 'Supabase'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
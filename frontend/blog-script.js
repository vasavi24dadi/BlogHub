// Dynamic API URL for development and production
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://your-render-backend-url.onrender.com/api'; // Replace with your actual Render URL
let allBlogs = [];
let filteredBlogs = [];
let currentFilter = 'all';
let currentSearchTerm = '';
let currentBlog = null;
let blogComments = {};
const FALLBACK_IMAGE_SMALL = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22300%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2216%22 fill=%22%23999%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EBlog Image%3C/text%3E%3C/svg%3E';
const FALLBACK_IMAGE_LARGE = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22400%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22800%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 fill=%22%23999%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EBlog Image%3C/text%3E%3C/svg%3E';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadBlogs();
    setupEventListeners();
    initializeComments();
});

function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.category;
            applyFilters();
        });
    });

    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.toLowerCase();
            applyFilters();
        });
    }

    // Comment form
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', postComment);
    }
}

// Load Blogs
async function loadBlogs() {
    try {
        const response = await fetch(`${API_URL}/blogs`);
        allBlogs = await response.json();
        applyFilters();
    } catch (error) {
        console.error('Error loading blogs:', error);
        document.getElementById('blogsContainer').innerHTML = 
            '<div class="no-blogs">Error loading blogs. Make sure backend server is running on http://localhost:5000</div>';
    }
}

// Apply Filters
function applyFilters() {
    filteredBlogs = allBlogs.filter(blog => {
        const matchesCategory = currentFilter === 'all' || blog.category === currentFilter;
        const matchesSearch = blog.title.toLowerCase().includes(currentSearchTerm) ||
                            blog.content.toLowerCase().includes(currentSearchTerm);
        return matchesCategory && matchesSearch;
    });

    displayBlogs();
}

// Display Blogs
function displayBlogs() {
    const container = document.getElementById('blogsContainer');

    if (filteredBlogs.length === 0) {
        container.innerHTML = '<div class="no-blogs">No blogs found. Try a different filter or search term.</div>';
        return;
    }

    container.innerHTML = filteredBlogs.map(blog => `
        <div class="blog-post" onclick="openBlogModal(${blog.id})">
            ${blog.featured_image ? 
                `<img src="${blog.featured_image.startsWith('http') ? blog.featured_image : (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://your-render-backend-url.onrender.com') + blog.featured_image}" alt="${blog.title}" class="blog-image" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE_SMALL}'">` : 
                '<div class="blog-image"></div>'
            }
            <div class="blog-content">
                <span class="blog-category">${blog.category}</span>
                <h3 class="blog-title">${escapeHtml(blog.title)}</h3>
                <p class="blog-excerpt">${stripHtml(blog.content).substring(0, 150)}...</p>
                <div class="blog-meta">
                    <span class="blog-date">📅 ${new Date(blog.created_at).toLocaleDateString()}</span>
                    <span class="blog-views">👁️ ${blog.views || 0} views</span>
                </div>
                <button class="read-more-btn">Read More</button>
            </div>
        </div>
    `).join('');
}

// Open Blog Modal
async function openBlogModal(blogId) {
    try {
        // Set current blog
        currentBlog = allBlogs.find(b => b.id === blogId);
        
        // Increment view count
        await fetch(`${API_URL}/blogs/${blogId}/view`, {
            method: 'PUT'
        });

        const response = await fetch(`${API_URL}/blogs/${blogId}`);
        const blog = await response.json();

        const modal = document.getElementById('blogModal');
        const content = document.getElementById('blogDetailContent');

        content.innerHTML = `
            <div class="blog-detail-header">
                ${blog.featured_image ? 
                    `<img src="${blog.featured_image.startsWith('http') ? blog.featured_image : (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://your-render-backend-url.onrender.com') + blog.featured_image}" alt="${blog.title}" class="blog-detail-image" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE_LARGE}'">` : 
                    '<div class="blog-detail-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>'
                }
                <span class="blog-detail-category">${blog.category}</span>
                <h1 class="blog-detail-title">${escapeHtml(blog.title)}</h1>
                <div class="blog-detail-meta">
                    <span>📅 ${new Date(blog.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</span>
                    <span>👁️ ${blog.views || 1} views</span>
                    <span>✏️ ${blog.author || 'Admin'}</span>
                </div>
            </div>
            <div class="blog-detail-content">
                ${blog.content}
            </div>
        `;

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Load comments and show recommendations
        loadBlogComments(blogId);
        showRecommendations();
        
        // Reload blogs to get updated view count
        setTimeout(loadBlogs, 500);
    } catch (error) {
        console.error('Error loading blog:', error);
        alert('Error loading blog details');
    }
}

// Close Blog Modal
function closeBlogModal() {
    const modal = document.getElementById('blogModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Go to Admin
function goToAdmin() {
    window.location.href = 'admin.html';
}

// Helper Functions
function stripHtml(html) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Comments System
function initializeComments() {
    const saved = localStorage.getItem('blogComments');
    blogComments = saved ? JSON.parse(saved) : {};
}

function loadBlogComments(blogId) {
    const comments = blogComments[blogId] || [];
    const container = document.getElementById('commentsContainer');
    if (!container) return;

    if (comments.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No comments yet. Be the first to comment!</p>';
        return;
    }

    container.innerHTML = comments.map((comment, index) => `
        <div style="padding: 12px; background: #f9f9f9; border-radius: 4px; margin-bottom: 10px; border-left: 3px solid #667eea;">
            <div style="font-weight: 600; color: #333; margin-bottom: 3px;">${escapeHtml(comment.name)}</div>
            <div style="font-size: 12px; color: #999; margin-bottom: 5px;">${new Date(comment.timestamp).toLocaleString()}</div>
            <div style="color: #555; margin-bottom: 8px;">${escapeHtml(comment.text)}</div>
            <button onclick="deleteComment(${blogId}, ${index})" style="padding: 4px 8px; font-size: 11px; background: #ff6b6b; color: white; border: none; border-radius: 3px; cursor: pointer;">Delete</button>
        </div>
    `).join('');
}

function postComment(e) {
    e.preventDefault();
    
    if (!currentBlog) return;

    const name = document.getElementById('commentName').value.trim();
    const text = document.getElementById('commentText').value.trim();

    if (!name || !text) {
        alert('Please fill in both name and comment!');
        return;
    }

    if (!blogComments[currentBlog.id]) {
        blogComments[currentBlog.id] = [];
    }

    blogComments[currentBlog.id].push({
        name,
        text,
        timestamp: new Date().toISOString()
    });

    localStorage.setItem('blogComments', JSON.stringify(blogComments));
    
    document.getElementById('commentForm').reset();
    loadBlogComments(currentBlog.id);
    alert('Comment posted successfully!');
}

function deleteComment(blogId, index) {
    if (confirm('Delete this comment?')) {
        if (blogComments[blogId]) {
            blogComments[blogId].splice(index, 1);
            localStorage.setItem('blogComments', JSON.stringify(blogComments));
            loadBlogComments(blogId);
        }
    }
}

// Social Sharing
function shareOnFacebook() {
    if (!currentBlog) return;
    const url = window.location.href;
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

function shareOnTwitter() {
    if (!currentBlog) return;
    const url = window.location.href;
    const text = currentBlog.title || 'Check out this blog!';
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

function shareViaEmail() {
    if (!currentBlog) return;
    const subject = currentBlog.title || 'Check out this blog';
    const body = `I found this interesting blog:\n\n${currentBlog.title}\n\n${window.location.href}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function copyBlogLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('Blog link copied to clipboard!');
    }).catch(() => {
        alert('Could not copy link. Please try again.');
    });
}

// Recommendations
function showRecommendations() {
    const recSection = document.getElementById('recommendationsSection');
    if (!recSection) return;

    // Get random blogs excluding currently viewed
    const recommendations = allBlogs
        .filter(b => b.id !== currentBlog?.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    if (recommendations.length === 0) {
        recSection.style.display = 'none';
        return;
    }

    recSection.style.display = 'block';
    const container = document.getElementById('recommendationsContainer');
    container.innerHTML = recommendations.map(blog => `
        <div class="blog-post" onclick="openBlogModal(${blog.id})">
            ${blog.featured_image ? 
                `<img src="${blog.featured_image}" alt="${blog.title}" class="blog-image" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE_SMALL}'">` : 
                '<div class="blog-image"></div>'
            }
            <div class="blog-content">
                <span class="blog-category">${blog.category}</span>
                <h3 class="blog-title">${escapeHtml(blog.title)}</h3>
                <p class="blog-excerpt">${stripHtml(blog.content).substring(0, 150)}...</p>
                <div class="blog-meta">
                    <span>👁️ ${blog.views || 0} views</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize comments on page load
initializeComments();

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('blogModal');
    if (e.target === modal) {
        closeBlogModal();
    }
});

// Close modal on ESC key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeBlogModal();
    }
});

const API_URL = 'http://localhost:5000/api';
let currentUser = null;
let authToken = null;
let currentEditingBlogId = null;
let allBlogs = [];
let drafts = [];

// File Upload Helper Functions - Define before DOMContentLoaded
function showImagePreview(inputElement, previewContainerId, previewImgId) {
    const file = inputElement.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById(previewContainerId);
            const img = document.getElementById(previewImgId);
            img.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

async function uploadImageFile(fileInputId, previewContainerId, previewImgId, urlInputId) {
    const fileInput = document.getElementById(fileInputId);
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select an image first');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            const relativePath = data.imageUrl;
            const previewUrl = `http://localhost:5000${relativePath}`;
            
            // Store the relative path in the hidden input
            document.getElementById(urlInputId).value = relativePath;
            
            // Show preview using absolute URL
            const preview = document.getElementById(previewContainerId);
            const img = document.getElementById(previewImgId);
            img.src = previewUrl;
            preview.style.display = 'block';
            
            alert('Image uploaded successfully!');
        } else {
            alert('Failed to upload image');
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image');
    }
}

async function uploadImage(fileInputId) {
    const fileInput = document.getElementById(fileInputId);
    const file = fileInput.files[0];
    
    if (!file) {
        return null;
    }
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.imageUrl;
        } else {
            console.error('Upload failed:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
}

=======
>>>>>>> 59c3b8876f716095abe9769a0b4c7fbbf22e620a
// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
        authToken = savedToken;
        currentUser = JSON.parse(savedUser);
        showDashboard();
    }

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    if (document.getElementById('createBlogForm')) {
        document.getElementById('createBlogForm').addEventListener('submit', handleCreateBlog);
    }
    if (document.getElementById('editBlogForm')) {
        document.getElementById('editBlogForm').addEventListener('submit', handleUpdateBlog);
    }
    if (document.getElementById('logoutBtn')) {
        document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    }

<<<<<<< HEAD
    // File upload preview listeners
    if (document.getElementById('featuredImage')) {
        document.getElementById('featuredImage').addEventListener('change', (e) => {
            showImagePreview(e.target, 'imagePreview', 'previewImg');
        });
    }
    if (document.getElementById('editFeaturedImage')) {
        document.getElementById('editFeaturedImage').addEventListener('change', (e) => {
            showImagePreview(e.target, 'editImagePreview', 'editPreviewImg');
        });
    }
    if (document.getElementById('uploadFeaturedImageBtn')) {
        document.getElementById('uploadFeaturedImageBtn').addEventListener('click', () => {
            uploadImageFile('featuredImage', 'imagePreview', 'previewImg', 'featuredImageUrl');
        });
    }
    if (document.getElementById('uploadEditFeaturedImageBtn')) {
        document.getElementById('uploadEditFeaturedImageBtn').addEventListener('click', () => {
            uploadImageFile('editFeaturedImage', 'editImagePreview', 'editPreviewImg', 'editFeaturedImageUrl');
        });
    }

=======
>>>>>>> 59c3b8876f716095abe9769a0b4c7fbbf22e620a
    // Search and Filter
    if (document.getElementById('blogSearch')) {
        document.getElementById('blogSearch').addEventListener('input', searchBlogs);
    }
    if (document.getElementById('filterCategory')) {
        document.getElementById('filterCategory').addEventListener('change', filterBlogs);
    }
    if (document.getElementById('editSearch')) {
        document.getElementById('editSearch').addEventListener('input', searchEditBlogs);
    }

    // Sidebar navigation
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            e.target.closest('.sidebar-btn').classList.add('active');
            const section = e.target.closest('.sidebar-btn').dataset.section;
            document.getElementById(section).classList.add('active');
            
            if (section === 'edit-blog') {
                loadBlogsForEdit();
            } else if (section === 'blogs-list') {
                loadBlogs();
            } else if (section === 'drafts') {
                loadDrafts();
            } else if (section === 'categories') {
                loadCategoryStats();
            }
        });
    });

    if (document.getElementById('editBlogSelect')) {
        document.getElementById('editBlogSelect').addEventListener('change', handleEditBlogSelect);
    }
});

// Login Handler
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.success) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showDashboard();
        } else {
            alert('Login failed: ' + data.message);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Error logging in. Make sure backend server is running on http://localhost:5000');
    }
}

// Show Dashboard
function showDashboard() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'flex';
    document.getElementById('userDisplay').textContent = currentUser.username;
    loadBlogs();
}

// Load Blogs
async function loadBlogs() {
    try {
        const response = await fetch(`${API_URL}/blogs`);
        allBlogs = await response.json();
        displayBlogs(allBlogs);
    } catch (error) {
        console.error('Error loading blogs:', error);
        document.getElementById('blogsList').innerHTML = '<p class="loading">Error loading blogs</p>';
    }
}

// Create Blog
async function handleCreateBlog(e) {
    e.preventDefault();
    
    const title = document.getElementById('blogTitle').value;
    const category = document.getElementById('blogCategory').value;
<<<<<<< HEAD
=======
    const featured_image = document.getElementById('featuredImage').value;
>>>>>>> 59c3b8876f716095abe9769a0b4c7fbbf22e620a
    const content = document.getElementById('blogContent').value;

    if (!title || !category || !content) {
        alert('Please fill in all required fields');
        return;
    }

    try {
<<<<<<< HEAD
        let featured_image = document.getElementById('featuredImageUrl').value || 
                            document.getElementById('featuredImageUrlManual').value || null;
        const fileInput = document.getElementById('featuredImage');
        if (!featured_image && fileInput.files.length > 0) {
            featured_image = await uploadImage('featuredImage');
            document.getElementById('featuredImageUrl').value = featured_image || '';
        }

=======
>>>>>>> 59c3b8876f716095abe9769a0b4c7fbbf22e620a
        const response = await fetch(`${API_URL}/blogs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ title, category, featured_image, content })
        });

        if (response.ok) {
            document.getElementById('blogTitle').value = '';
            document.getElementById('blogCategory').value = '';
            document.getElementById('featuredImage').value = '';
<<<<<<< HEAD
            document.getElementById('featuredImageUrl').value = '';
            document.getElementById('featuredImageUrlManual').value = '';
            document.getElementById('imagePreview').style.display = 'none';
=======
>>>>>>> 59c3b8876f716095abe9769a0b4c7fbbf22e620a
            document.getElementById('blogContent').value = '';
            alert('Blog created successfully!');
            loadBlogs();
        } else {
            alert('Failed to create blog');
        }
    } catch (error) {
        console.error('Error creating blog:', error);
        alert('Error creating blog');
    }
}

// Display Blogs
function displayBlogs(blogs) {
    const blogsList = document.getElementById('blogsList');
    if (!blogs || blogs.length === 0) {
        blogsList.innerHTML = '<p class="loading">No blogs found. Create your first blog!</p>';
        return;
    }

    blogsList.innerHTML = blogs.map(blog => `
        <div class="blog-card">
            ${blog.featured_image ? `<img src="${blog.featured_image}" alt="${blog.title}" class="blog-card-image">` : '<div class="blog-card-image" style="background: #667eea;"></div>'}
            <div class="blog-card-content">
                <div class="blog-card-title">${blog.title}</div>
                <span class="blog-card-category">${blog.category}</span>
                <div style="font-size: 12px; color: #999; margin-top: 8px;">
                    Views: ${blog.views || 0} | ${new Date(blog.created_at).toLocaleDateString()}
                </div>
                <div class="blog-card-actions">
                    <button class="btn-edit" onclick="editBlog(${blog.id})">Edit</button>
                    <button class="btn-delete" onclick="confirmDelete(${blog.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Search Blogs
function searchBlogs() {
    const searchTerm = document.getElementById('blogSearch').value.toLowerCase();
    const category = document.getElementById('filterCategory').value;
    
    let filtered = allBlogs.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm)
    );
    
    if (category) {
        filtered = filtered.filter(blog => blog.category === category);
    }
    
    displayBlogs(filtered);
}

// Filter Blogs
function filterBlogs() {
    searchBlogs();
}

// Search Edit Blogs
function searchEditBlogs() {
    const searchTerm = document.getElementById('editSearch').value.toLowerCase();
    const select = document.getElementById('editBlogSelect');
    
    const options = select.querySelectorAll('option');
    options.forEach(option => {
        if (option.value === '') {
            option.style.display = 'block';
        } else {
            const text = option.textContent.toLowerCase();
            option.style.display = text.includes(searchTerm) ? 'block' : 'none';
        }
    });
}

// Load Blogs for Edit
async function loadBlogsForEdit() {
    try {
        const response = await fetch(`${API_URL}/blogs`);
        const blogs = await response.json();

        const select = document.getElementById('editBlogSelect');
        select.innerHTML = '<option value="">Choose a blog...</option>' + 
            blogs.map(blog => `<option value="${blog.id}">${blog.title}</option>`).join('');
    } catch (error) {
        console.error('Error loading blogs:', error);
    }
}

// Handle Edit Blog Select
async function handleEditBlogSelect(e) {
    const blogId = e.target.value;
    if (!blogId) {
        document.getElementById('editBlogForm').style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/blogs/${blogId}`);
        const blog = await response.json();

        currentEditingBlogId = blog.id;
        document.getElementById('editBlogTitle').value = blog.title;
        document.getElementById('editBlogCategory').value = blog.category;
<<<<<<< HEAD
        document.getElementById('editFeaturedImage').value = '';
        document.getElementById('editFeaturedImageUrl').value = blog.featured_image || '';
        document.getElementById('editFeaturedImageUrlManual').value = blog.featured_image || '';
        document.getElementById('editBlogContent').value = blog.content;
        
        // Show existing image if available
        if (blog.featured_image) {
            const preview = document.getElementById('editImagePreview');
            const img = document.getElementById('editPreviewImg');
            img.src = blog.featured_image.startsWith('http') ? blog.featured_image : `http://localhost:5000${blog.featured_image}`;
            preview.style.display = 'block';
        } else {
            document.getElementById('editImagePreview').style.display = 'none';
        }
        
=======
        document.getElementById('editFeaturedImage').value = blog.featured_image || '';
        document.getElementById('editBlogContent').value = blog.content;
>>>>>>> 59c3b8876f716095abe9769a0b4c7fbbf22e620a
        document.getElementById('editBlogForm').style.display = 'block';
    } catch (error) {
        console.error('Error loading blog:', error);
        alert('Error loading blog details');
    }
}

// Update Blog
async function handleUpdateBlog(e) {
    e.preventDefault();
    
    if (!currentEditingBlogId) {
        alert('No blog selected');
        return;
    }

    const title = document.getElementById('editBlogTitle').value;
    const category = document.getElementById('editBlogCategory').value;
<<<<<<< HEAD
    const content = document.getElementById('editBlogContent').value;

    try {
        let featured_image = document.getElementById('editFeaturedImageUrl').value || 
                            document.getElementById('editFeaturedImageUrlManual').value || null;
        const fileInput = document.getElementById('editFeaturedImage');
        if (!featured_image && fileInput.files.length > 0) {
            featured_image = await uploadImage('editFeaturedImage');
            document.getElementById('editFeaturedImageUrl').value = featured_image || '';
        }

=======
    const featured_image = document.getElementById('editFeaturedImage').value;
    const content = document.getElementById('editBlogContent').value;

    try {
>>>>>>> 59c3b8876f716095abe9769a0b4c7fbbf22e620a
        const response = await fetch(`${API_URL}/blogs/${currentEditingBlogId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ title, category, featured_image, content })
        });

        if (response.ok) {
            alert('Blog updated successfully!');
            cancelEdit();
            loadBlogs();
        } else {
            alert('Error updating blog');
        }
    } catch (error) {
        console.error('Error updating blog:', error);
        alert('Error updating blog');
    }
}

// Edit Blog (Direct)
function editBlog(blogId) {
    const select = document.getElementById('editBlogSelect');
    select.value = blogId;
    handleEditBlogSelect({ target: select });
    
    // Switch to edit section
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelector('[data-section="edit-blog"]').classList.add('active');
    document.getElementById('edit-blog').classList.add('active');
}

// Delete Blog
async function deleteBlog() {
    if (!currentEditingBlogId) {
        alert('No blog selected');
        return;
    }

    if (!confirm('Are you sure you want to delete this blog?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/blogs/${currentEditingBlogId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            alert('Blog deleted successfully!');
            cancelEdit();
            loadBlogs();
        } else {
            alert('Error deleting blog');
        }
    } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Error deleting blog');
    }
}

// Confirm Delete
function confirmDelete(blogId) {
    if (!confirm('Are you sure you want to delete this blog?')) {
        return;
    }

    fetch(`${API_URL}/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    }).then(response => {
        if (response.ok) {
            alert('Blog deleted successfully!');
            loadBlogs();
        } else {
            alert('Error deleting blog');
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('Error deleting blog');
    });
}

// Cancel Edit
function cancelEdit() {
    currentEditingBlogId = null;
    document.getElementById('editBlogForm').reset();
    document.getElementById('editBlogSelect').value = '';
    document.getElementById('editBlogForm').style.display = 'none';
}

// Logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        authToken = null;
        currentUser = null;
        document.getElementById('login-section').style.display = 'flex';
        document.getElementById('dashboard-section').style.display = 'none';
        document.getElementById('loginForm').reset();
    }
}

// Editor Functions
function insertTag(tag, textareaId = 'blogContent') {
    const textarea = document.getElementById(textareaId);
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || 'Your text here';
    
    let openTag = `<${tag}>`;
    let closeTag = `</${tag}>`;
    
    if (tag === 'b') {
        openTag = '<strong>';
        closeTag = '</strong>';
    } else if (tag === 'i') {
        openTag = '<em>';
        closeTag = '</em>';
    }
    
    const newText = openTag + selectedText + closeTag;
    textarea.value = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    textarea.focus();
}

function insertList(type = 'ul', textareaId = 'blogContent') {
    const textarea = document.getElementById(textareaId);
    const listHtml = `<${type}><li>Item 1</li><li>Item 2</li><li>Item 3</li></${type}>`;
    textarea.value += '\n' + listHtml + '\n';
    textarea.focus();
}

function insertTable(textareaId = 'blogContent') {
    const textarea = document.getElementById(textareaId);
    const tableHtml = `<table><tr><th>Header 1</th><th>Header 2</th></tr><tr><td>Data 1</td><td>Data 2</td></tr></table>`;
    textarea.value += '\n' + tableHtml + '\n';
    textarea.focus();
}

// Drafts Management
function saveDraft() {
    const title = document.getElementById('blogTitle').value;
    const content = document.getElementById('blogContent').value;
    const category = document.getElementById('blogCategory').value;
<<<<<<< HEAD
    const featured_image = document.getElementById('featuredImageUrl').value || 
                          document.getElementById('featuredImageUrlManual').value;
=======
    const featured_image = document.getElementById('featuredImage').value;
>>>>>>> 59c3b8876f716095abe9769a0b4c7fbbf22e620a
    
    if (!title || !content || !category) {
        alert('Please fill in all required fields');
        return;
    }
    
    const draft = {
        id: Date.now(),
        title,
        content,
        category,
        featured_image,
        saved_at: new Date().toISOString()
    };
    
    drafts.push(draft);
    localStorage.setItem('blogDrafts', JSON.stringify(drafts));
    alert('Blog saved as draft!');
    document.getElementById('createBlogForm').reset();
}

<<<<<<< HEAD

=======
>>>>>>> 59c3b8876f716095abe9769a0b4c7fbbf22e620a
function loadDrafts() {
    const saved = localStorage.getItem('blogDrafts');
    drafts = saved ? JSON.parse(saved) : [];
    
    const draftsList = document.getElementById('draftsList');
    if (drafts.length === 0) {
        draftsList.innerHTML = '<p class="loading">No drafts saved yet.</p>';
        return;
    }
    
    draftsList.innerHTML = drafts.map((draft, index) => `
        <div class="blog-card">
            <div class="blog-card-image" style="background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 30px;">📝</div>
            <div class="blog-card-content">
                <div class="blog-card-title">${draft.title}</div>
                <span class="blog-card-category">${draft.category}</span>
                <div style="font-size: 12px; color: #999; margin-top: 8px;">
                    Saved: ${new Date(draft.saved_at).toLocaleDateString()}
                </div>
                <div class="blog-card-actions">
                    <button class="btn-edit" onclick="editDraft(${index})">Edit</button>
                    <button class="btn-delete" onclick="deleteDraft(${index})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function editDraft(index) {
    const draft = drafts[index];
    if (draft) {
        document.getElementById('blogTitle').value = draft.title;
        document.getElementById('blogContent').value = draft.content;
        document.getElementById('blogCategory').value = draft.category;
<<<<<<< HEAD
        document.getElementById('featuredImageUrlManual').value = draft.featured_image || '';
        document.getElementById('featuredImageUrl').value = draft.featured_image || '';
=======
        document.getElementById('featuredImage').value = draft.featured_image;
>>>>>>> 59c3b8876f716095abe9769a0b4c7fbbf22e620a
        deleteDraft(index);
        
        document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        document.querySelector('[data-section="create-blog"]').classList.add('active');
        document.getElementById('create-blog').classList.add('active');
    }
}

function deleteDraft(index) {
    drafts.splice(index, 1);
    localStorage.setItem('blogDrafts', JSON.stringify(drafts));
    loadDrafts();
}

// Category Management
async function loadCategoryStats() {
    try {
        const response = await fetch(`${API_URL}/blogs`);
        const blogs = await response.json();
        
        const categories = ['Latest Jobs', 'Admit Card', 'Results', 'News', 'Updates', 'Other'];
        categories.forEach(cat => {
            const count = blogs.filter(b => b.category === cat).length;
            const element = document.getElementById(`count-${cat.toLowerCase().replace(/ /g, '-')}`);
            if (element) {
                element.textContent = `${count} ${count === 1 ? 'blog' : 'blogs'}`;
            }
        });
    } catch (error) {
        console.error('Error loading category stats:', error);
    }
}

function filterByCategory(category) {
    document.getElementById('filterCategory').value = category;
    const searchTerm = document.getElementById('blogSearch').value.toLowerCase();
    
    let filtered = allBlogs.filter(blog => blog.category === category);
    
    if (searchTerm) {
        filtered = filtered.filter(blog => blog.title.toLowerCase().includes(searchTerm));
    }
    
    displayBlogs(filtered);
    
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelector('[data-section="blogs-list"]').classList.add('active');
    document.getElementById('blogs-list').classList.add('active');
}

function insertList(type, textareaId = 'blogContent') {
    const textarea = document.getElementById(textareaId);
    const tag = type === 'ul' ? 'ul' : 'ol';
    const itemTag = 'li';
    
    const listHTML = `<${tag}>
  <${itemTag}>Item 1</${itemTag}>
  <${itemTag}>Item 2</${itemTag}>
  <${itemTag}>Item 3</${itemTag}>
</${tag}>`;
    
    textarea.value += '\n' + listHTML;
    textarea.focus();
}

function insertTable(textareaId = 'blogContent') {
    const textarea = document.getElementById(textareaId);
    const tableHTML = `<table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse;">
  <tr>
    <th>Header 1</th>
    <th>Header 2</th>
    <th>Header 3</th>
  </tr>
  <tr>
    <td>Row 1, Col 1</td>
    <td>Row 1, Col 2</td>
    <td>Row 1, Col 3</td>
  </tr>
  <tr>
    <td>Row 2, Col 1</td>
    <td>Row 2, Col 2</td>
    <td>Row 2, Col 3</td>
  </tr>
</table>`;
    
    textarea.value += '\n' + tableHTML;
    textarea.focus();
}

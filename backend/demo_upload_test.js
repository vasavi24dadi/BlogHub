const fs = require('fs');
const path = require('path');
const http = require('http');

const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const uploadPath = path.join(uploadDir, 'demo-upload.png');
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/D/PwAI/gN+Yy+JXwAAAABJRU5ErkJggg==', 'base64');
fs.writeFileSync(uploadPath, png);
console.log('Wrote file', uploadPath);

const data = JSON.stringify({
  title: 'Demo Upload Image',
  content: '<p>Demo image upload content</p>',
  category: 'News',
  featured_image: '/uploads/demo-upload.png'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/blogs',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    'Authorization': 'Bearer admin_token_12345'
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Create blog status', res.statusCode, body);
    http.get('http://localhost:5000/uploads/demo-upload.png', (res2) => {
      console.log('Image served status', res2.statusCode, res2.headers['content-type']);
      res2.on('data', () => {});
      res2.on('end', () => console.log('Image fetch complete'));
    }).on('error', (e) => console.error('Image fetch error', e.message));
  });
});

req.on('error', (e) => console.error('Request error', e.message));
req.write(data);
req.end();

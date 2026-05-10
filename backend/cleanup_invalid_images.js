const http = require('http');

http.get('http://localhost:5000/api/blogs', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('All blogs:');
      json.forEach(b => {
        console.log(`ID ${b.id}: ${b.title} - ${b.featured_image}`);
      });

      const invalid = json.filter(b => b.featured_image && b.featured_image.startsWith('C:\\fakepath\\'));
      console.log('\nInvalid blogs to clean up:');
      invalid.forEach(b => {
        console.log(`ID ${b.id}: ${b.title} - ${b.featured_image}`);
      });

      if (invalid.length > 0) {
        console.log('\nCleaning up invalid blogs...');
        invalid.forEach(blog => {
          const updateData = JSON.stringify({
            title: blog.title,
            content: blog.content,
            category: blog.category,
            featured_image: null
          });

          const options = {
            hostname: 'localhost',
            port: 5000,
            path: `/api/blogs/${blog.id}`,
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(updateData),
              'Authorization': 'Bearer admin_token_12345'
            }
          };

          const req = http.request(options, (res2) => {
            let body = '';
            res2.on('data', (chunk) => body += chunk);
            res2.on('end', () => {
              console.log(`Updated blog ${blog.id}: ${res2.statusCode}`);
            });
          });

          req.on('error', (e) => console.error(`Error updating blog ${blog.id}:`, e.message));
          req.write(updateData);
          req.end();
        });
      } else {
        console.log('No invalid blogs found to clean up.');
      }
    } catch (e) {
      console.error('Parse error:', e);
    }
  });
}).on('error', (e) => console.error('Request error:', e.message));
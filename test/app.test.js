const http = require('http');
const app = require('../app');

const PORT = 4000;

// Simple test runner without external libs
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

const server = app.listen(PORT, () => {
  const options = {
    hostname: '127.0.0.1',
    port: PORT,
    path: '/',
    method: 'GET'
  };

  const req = http.request(options, res => {
    let data = '';
    res.on('data', chunk => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        assert(res.statusCode === 200, `Expected status 200, got ${res.statusCode}`);
        const json = JSON.parse(data);
        assert(json.message === 'Hello from CI/CD DevSecOps demo app!', 'Unexpected response message');
        console.log('All tests passed');
        server.close(() => process.exit(0));
      } catch (err) {
        console.error('Test failed:', err.message);
        server.close(() => process.exit(1));
      }
    });
  });

  req.on('error', error => {
    console.error('Request error:', error);
    server.close(() => process.exit(1));
  });

  req.end();
});

const express = require('express');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello from CI/CD DevSecOps demo app!' });
});

app.use('/api/tasks', taskRoutes);

// Don't connect to DB when testing
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

module.exports = app;

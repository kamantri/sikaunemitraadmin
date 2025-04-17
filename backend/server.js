
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database connection
const { pool } = require('./db/db');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const notesRoutes = require('./routes/notes');
const courseRoutes = require('./routes/courses');
const blogRoutes = require('./routes/blogs');
const mediaRoutes = require('./routes/media');

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Make db available to routes
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/media', mediaRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to sikaunemitra API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;  // Changed from 4000 to 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/db');
const logger = require('../utils/logger');

// Regular user login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      logger.warn('Login attempt without email or password');
      return res.status(400).json({ 
        status: 'error',
        message: 'Email and password are required',
        details: 'Missing required fields'
      });
    }
    
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      logger.warn(`Failed login attempt for email: ${email}`);
      return res.status(401).json({ 
        status: 'error',
        message: 'Invalid credentials',
        details: 'User not found'
      });
    }
    
    const user = users[0];
    
    logger.info('User found:', { 
      email: user.email, 
      hasPassword: !!user.password,
      timestamp: new Date().toISOString()
    });
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      logger.warn(`Invalid password for email: ${email}`);
      return res.status(401).json({ 
        status: 'error',
        message: 'Invalid credentials',
        details: 'Password mismatch'
      });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    logger.info(`Successful login for user: ${email}`);
    
    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    logger.error('Login error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      status: 'error',
      message: 'Server error',
      details: 'An unexpected error occurred'
    });
  }
});

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      logger.warn('Admin login attempt without email or password');
      return res.status(400).json({ 
        status: 'error',
        message: 'Email and password are required',
        details: 'Missing required fields'
      });
    }
    
    const [admins] = await pool.query('SELECT * FROM admin WHERE email = ?', [email]);
    
    if (admins.length === 0) {
      logger.warn(`Failed admin login attempt for email: ${email}`);
      return res.status(401).json({ 
        status: 'error',
        message: 'Invalid credentials',
        details: 'Admin not found'
      });
    }
    
    const admin = admins[0];
    
    logger.info('Admin found:', { 
      email: admin.email, 
      hasPassword: !!admin.password,
      timestamp: new Date().toISOString()
    });
    
    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
      logger.warn(`Invalid password for admin: ${email}`);
      return res.status(401).json({ 
        status: 'error',
        message: 'Invalid credentials',
        details: 'Password mismatch'
      });
    }
    
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    logger.info(`Successful login for admin: ${email}`);
    
    res.json({
      status: 'success',
      message: 'Admin login successful',
      data: {
        token,
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: 'admin'
        }
      }
    });
  } catch (error) {
    logger.error('Admin login error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      status: 'error',
      message: 'Server error',
      details: 'An unexpected error occurred'
    });
  }
});

module.exports = router;

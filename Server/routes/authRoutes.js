import express from 'express';
import db from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
// Admin login
router.post('/admin/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const [adminRows] = await db.query('SELECT * FROM admin WHERE email = ?', [email]);
      const admin = adminRows[0];
  
      if (!admin) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
  
      const validPassword = await bcrypt.compare(password, admin.password);
  
      if (!validPassword) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
  
      const token = jwt.sign(
        { 
          id: admin.id,
          role: 'admin' // Add role to token payload
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
      );
      
      // Store token in database with role
      await db.query(
        'INSERT INTO admin_tokens (admin_id, token, expires_at) VALUES (?, ?, ?)',
        [admin.id, token, new Date(Date.now() + 24 * 60 * 60 * 1000)]
      );
  
      res.json({
        success: true,
        data: {
          token,
          id: admin.id,
          email: admin.email
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Server error occurred' });
    }
});


// Create new admin
router.post('/admin/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({ 
          status: "error", 
          message: "name, email, and password are required" 
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.query(
        "INSERT INTO admin (name, email, password, role) VALUES (?, ?, ?, 'admin')",
        [name, email, hashedPassword]
      );
      
      res.status(201).json({ 
        status: "success", 
        message: "Admin created successfully",
        data: { id: result.insertId, name, email, role: 'admin' }
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });


// User login
router.post('/user/login', async (req, res) => {
  try {
    const { email, password, } = req.body;

    const [userRows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = userRows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role // Add user's role to token payload
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Store token in database with role
    await db.query(
      'INSERT INTO tokens (user_id, token, expires_at, role) VALUES (?, ?, ?, ?)',
      [user.id, token, new Date(Date.now() + 24 * 60 * 60 * 1000), user.role]
    );

    res.json({
      success: true,
      data: {
        token,
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ success: false, message: 'Server error occurred' });
  }
});

// User registration
router.post('/user/register', async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        status: "error", 
        message: "Name, email, and password are required" 
      });
    }

    // Validate role
    const validRoles = ['student', 'teacher'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid role. Must be either 'student' or 'teacher'"
      });
    }
    
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, password, role]
    );
    
    res.status(201).json({ 
      status: "success", 
      message: "User created successfully",
      data: { id: result.insertId, name, email, role }
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;
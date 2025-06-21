import express from 'express';
import { authenticateToken, isAdmin, isStudent } from '../middleware/auth.js';

const router = express.Router();

// Admin dashboard - requires valid JWT and admin role
router.get('/admin/dashboard', authenticateToken, isAdmin, (req, res) => {
  res.json({
    status: 'success',
    data: {
      message: 'Welcome to admin dashboard',
      user: req.user // Contains decoded token info
    }
  });
});

// Student profile - requires valid JWT and student role
router.get('/student/profile', authenticateToken, isStudent, (req, res) => {
  res.json({
    status: 'success',
    data: {
      message: 'Student profile accessed',
      studentInfo: {
        id: req.user.id,
        name: req.user.name
      }
    }
  });
});

export default router;
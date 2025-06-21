import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../config/database.js';

dotenv.config();

export const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Check admin_tokens first
    const [adminTokenRows] = await db.query(
      'SELECT * FROM admin_tokens WHERE token = ? AND expires_at > NOW()',
      [token]
    );

    // If not found in admin_tokens, check regular tokens
    const [userTokenRows] = adminTokenRows.length === 0 
      ? await db.query(
          'SELECT * FROM tokens WHERE token = ? AND expires_at > NOW()',
          [token]
        )
      : [[null]];

    if (adminTokenRows.length === 0 && userTokenRows.length === 0) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Add this to your auth middleware
const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify token exists in database and isn't expired
    const [tokenRecord] = await db.query(
      'SELECT * FROM tokens WHERE token = ? AND expires_at > NOW()',
      [token]
    );

    if (!tokenRecord) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

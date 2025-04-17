
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT b.*, u.name as author_name 
      FROM blogs b 
      LEFT JOIN users u ON b.author_id = u.id
      ORDER BY b.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blog by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT b.*, u.name as author_name 
      FROM blogs b 
      LEFT JOIN users u ON b.author_id = u.id
      WHERE b.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create blog
router.post('/', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { title, content, featured_image, status } = req.body;
    
    const [result] = await req.db.query(
      'INSERT INTO blogs (title, content, featured_image, status, author_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [title, content, featured_image, status || 'draft', req.user.id]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Blog created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blog
router.put('/:id', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { title, content, featured_image, status } = req.body;
    
    let updateFields = [];
    let updateValues = [];
    
    if (title) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    
    if (content) {
      updateFields.push('content = ?');
      updateValues.push(content);
    }
    
    if (featured_image) {
      updateFields.push('featured_image = ?');
      updateValues.push(featured_image);
    }
    
    if (status) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    
    updateFields.push('updated_at = NOW()');
    
    // Check if blog exists and if user is authorized
    const [blog] = await req.db.query('SELECT author_id FROM blogs WHERE id = ?', [req.params.id]);
    
    if (blog.length === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Only allow author or admin to update
    if (req.user.role !== 'admin' && blog[0].author_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }
    
    await req.db.query(
      `UPDATE blogs SET ${updateFields.join(', ')} WHERE id = ?`,
      [...updateValues, req.params.id]
    );
    
    res.json({ message: 'Blog updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blog
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [result] = await req.db.query('DELETE FROM blogs WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

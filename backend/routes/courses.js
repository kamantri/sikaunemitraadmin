
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate, authorize } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/courses';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG and PDF files are allowed.'));
    }
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let query = 'SELECT * FROM courses';
    const queryParams = [];
    
    if (category || search) {
      query += ' WHERE';
      
      if (category) {
        query += ' category = ?';
        queryParams.push(category);
      }
      
      if (search) {
        if (category) query += ' AND';
        query += ' (title LIKE ? OR description LIKE ?)';
        queryParams.push(`%${search}%`, `%${search}%`);
      }
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await req.db.query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course by id
router.get('/:id', async (req, res) => {
  try {
    // Get course details
    const [courses] = await req.db.query('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const course = courses[0];
    
    // Get course lessons
    const [lessons] = await req.db.query(
      'SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index ASC',
      [req.params.id]
    );
    
    course.lessons = lessons;
    
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create course
router.post('/', authenticate, authorize('admin', 'teacher'), upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category, duration, level } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    const imageUrl = req.file ? `/courses/${req.file.filename}` : null;
    
    const [result] = await req.db.query(
      `INSERT INTO courses (
        title, description, price, category, duration, level, image_url,
        created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [title, description, price || 0, category, duration, level, imageUrl, req.user.id]
    );
    
    res.status(201).json({ 
      message: 'Course created successfully',
      courseId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update course
router.put('/:id', authenticate, authorize('admin', 'teacher'), upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category, duration, level } = req.body;
    
    // Check if course exists
    const [courses] = await req.db.query('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is authorized to update this course
    const course = courses[0];
    if (req.user.role !== 'admin' && req.user.id != course.created_by) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    let updateFields = [];
    let updateValues = [];
    
    if (title) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    
    if (description) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    
    if (price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(price);
    }
    
    if (category) {
      updateFields.push('category = ?');
      updateValues.push(category);
    }
    
    if (duration) {
      updateFields.push('duration = ?');
      updateValues.push(duration);
    }
    
    if (level) {
      updateFields.push('level = ?');
      updateValues.push(level);
    }
    
    // Handle image upload
    if (req.file) {
      // Delete old image if exists
      if (course.image_url) {
        const oldPath = path.join(__dirname, '..', 'uploads', course.image_url);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      
      const imageUrl = `/courses/${req.file.filename}`;
      updateFields.push('image_url = ?');
      updateValues.push(imageUrl);
    }
    
    updateFields.push('updated_at = NOW()');
    
    await req.db.query(
      `UPDATE courses SET ${updateFields.join(', ')} WHERE id = ?`,
      [...updateValues, req.params.id]
    );
    
    res.json({ message: 'Course updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete course
router.delete('/:id', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    // Check if course exists
    const [courses] = await req.db.query('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is authorized to delete this course
    const course = courses[0];
    if (req.user.role !== 'admin' && req.user.id != course.created_by) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Delete the image if exists
    if (course.image_url) {
      const imagePath = path.join(__dirname, '..', 'uploads', course.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete lessons
    await req.db.query('DELETE FROM lessons WHERE course_id = ?', [req.params.id]);
    
    // Delete the course
    await req.db.query('DELETE FROM courses WHERE id = ?', [req.params.id]);
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add lesson to course
router.post('/:id/lessons', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { title, content, videoUrl, duration, orderIndex } = req.body;
    
    // Check if course exists
    const [courses] = await req.db.query('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is authorized to update this course
    const course = courses[0];
    if (req.user.role !== 'admin' && req.user.id != course.created_by) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const [result] = await req.db.query(
      `INSERT INTO lessons (
        course_id, title, content, video_url, duration, order_index, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [req.params.id, title, content, videoUrl, duration, orderIndex || 0]
    );
    
    res.status(201).json({ 
      message: 'Lesson added successfully',
      lessonId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update lesson
router.put('/:courseId/lessons/:lessonId', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { title, content, videoUrl, duration, orderIndex } = req.body;
    
    // Check if course exists
    const [courses] = await req.db.query('SELECT * FROM courses WHERE id = ?', [req.params.courseId]);
    
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is authorized to update this course
    const course = courses[0];
    if (req.user.role !== 'admin' && req.user.id != course.created_by) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Check if lesson exists
    const [lessons] = await req.db.query(
      'SELECT * FROM lessons WHERE id = ? AND course_id = ?', 
      [req.params.lessonId, req.params.courseId]
    );
    
    if (lessons.length === 0) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
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
    
    if (videoUrl) {
      updateFields.push('video_url = ?');
      updateValues.push(videoUrl);
    }
    
    if (duration) {
      updateFields.push('duration = ?');
      updateValues.push(duration);
    }
    
    if (orderIndex !== undefined) {
      updateFields.push('order_index = ?');
      updateValues.push(orderIndex);
    }
    
    updateFields.push('updated_at = NOW()');
    
    await req.db.query(
      `UPDATE lessons SET ${updateFields.join(', ')} WHERE id = ? AND course_id = ?`,
      [...updateValues, req.params.lessonId, req.params.courseId]
    );
    
    res.json({ message: 'Lesson updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete lesson
router.delete('/:courseId/lessons/:lessonId', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    // Check if course exists
    const [courses] = await req.db.query('SELECT * FROM courses WHERE id = ?', [req.params.courseId]);
    
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is authorized to update this course
    const course = courses[0];
    if (req.user.role !== 'admin' && req.user.id != course.created_by) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Delete the lesson
    const [result] = await req.db.query(
      'DELETE FROM lessons WHERE id = ? AND course_id = ?',
      [req.params.lessonId, req.params.courseId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

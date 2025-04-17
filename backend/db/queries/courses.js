
const db = require('../index');

// Courses queries
const courseQueries = {
  // Get all courses with optional filtering
  getAllCourses: async (filters = {}) => {
    const { category, search } = filters;
    
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
    
    return db.query(query, queryParams);
  },
  
  // Get course by id
  getCourseById: async (courseId) => {
    return db.query('SELECT * FROM courses WHERE id = ?', [courseId]);
  },
  
  // Get lessons for a course
  getCourseLessons: async (courseId) => {
    return db.query('SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index ASC', [courseId]);
  },
  
  // Create a new course
  createCourse: async (courseData) => {
    const { title, description, price, category, duration, level, imageUrl, userId } = courseData;
    
    const result = await db.query(
      `INSERT INTO courses (
        title, description, price, category, duration, level, image_url,
        created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [title, description, price || 0, category, duration, level, imageUrl, userId]
    );
    
    return result;
  },
  
  // Update a course
  updateCourse: async (courseId, courseData) => {
    const { title, description, price, category, duration, level, imageUrl } = courseData;
    
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
    
    if (imageUrl) {
      updateFields.push('image_url = ?');
      updateValues.push(imageUrl);
    }
    
    updateFields.push('updated_at = NOW()');
    
    const query = `UPDATE courses SET ${updateFields.join(', ')} WHERE id = ?`;
    return db.query(query, [...updateValues, courseId]);
  },
  
  // Delete a course
  deleteCourse: async (courseId) => {
    return db.query('DELETE FROM courses WHERE id = ?', [courseId]);
  },
  
  // Add a lesson to a course
  addLesson: async (courseId, lessonData) => {
    const { title, content, videoUrl, duration, orderIndex } = lessonData;
    
    const result = await db.query(
      `INSERT INTO lessons (
        course_id, title, content, video_url, duration, order_index, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [courseId, title, content, videoUrl, duration, orderIndex || 0]
    );
    
    return result;
  },
  
  // Update a lesson
  updateLesson: async (lessonId, courseId, lessonData) => {
    const { title, content, videoUrl, duration, orderIndex } = lessonData;
    
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
    
    const query = `UPDATE lessons SET ${updateFields.join(', ')} WHERE id = ? AND course_id = ?`;
    return db.query(query, [...updateValues, lessonId, courseId]);
  },
  
  // Delete a lesson
  deleteLesson: async (lessonId, courseId) => {
    return db.query('DELETE FROM lessons WHERE id = ? AND course_id = ?', [lessonId, courseId]);
  }
};

module.exports = courseQueries;

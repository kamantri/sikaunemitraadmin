
const db = require('../index');

// Enrollments queries
const enrollmentQueries = {
  // Get enrollments by user id
  getEnrollmentsByUser: async (userId) => {
    return db.query(`
      SELECT e.*, c.title, c.description, c.image_url
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = ?
      ORDER BY e.enrolled_at DESC
    `, [userId]);
  },
  
  // Get enrollments by course id
  getEnrollmentsByCourse: async (courseId) => {
    return db.query(`
      SELECT e.*, u.name, u.email
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      WHERE e.course_id = ?
      ORDER BY e.enrolled_at DESC
    `, [courseId]);
  },
  
  // Create a new enrollment
  createEnrollment: async (userId, courseId) => {
    return db.query(
      'INSERT INTO enrollments (user_id, course_id, enrolled_at) VALUES (?, ?, NOW())',
      [userId, courseId]
    );
  },
  
  // Update enrollment status
  updateEnrollmentStatus: async (userId, courseId, status) => {
    return db.query(
      'UPDATE enrollments SET status = ? WHERE user_id = ? AND course_id = ?',
      [status, userId, courseId]
    );
  },
  
  // Update enrollment progress
  updateEnrollmentProgress: async (userId, courseId, progress) => {
    return db.query(
      'UPDATE enrollments SET progress = ?, last_accessed = NOW() WHERE user_id = ? AND course_id = ?',
      [progress, userId, courseId]
    );
  },
  
  // Delete an enrollment
  deleteEnrollment: async (userId, courseId) => {
    return db.query('DELETE FROM enrollments WHERE user_id = ? AND course_id = ?', [userId, courseId]);
  }
};

module.exports = enrollmentQueries;

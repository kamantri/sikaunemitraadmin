
const db = require('../index');

// Purchases queries
const purchaseQueries = {
  // Get all purchases by user id
  getPurchasesByUser: async (userId) => {
    return db.query(`
      SELECT p.*, 
        n.title as note_title, 
        c.title as course_title
      FROM purchases p
      LEFT JOIN notes n ON p.note_id = n.id
      LEFT JOIN courses c ON p.course_id = c.id
      WHERE p.user_id = ?
      ORDER BY p.purchased_at DESC
    `, [userId]);
  },
  
  // Get purchases for a specific note
  getPurchasesByNote: async (noteId) => {
    return db.query(`
      SELECT p.*, u.name, u.email
      FROM purchases p
      JOIN users u ON p.user_id = u.id
      WHERE p.note_id = ?
      ORDER BY p.purchased_at DESC
    `, [noteId]);
  },
  
  // Get purchases for a specific course
  getPurchasesByCourse: async (courseId) => {
    return db.query(`
      SELECT p.*, u.name, u.email
      FROM purchases p
      JOIN users u ON p.user_id = u.id
      WHERE p.course_id = ?
      ORDER BY p.purchased_at DESC
    `, [courseId]);
  },
  
  // Create a new purchase
  createPurchase: async (purchaseData) => {
    const { userId, noteId, courseId, amount } = purchaseData;
    
    return db.query(
      `INSERT INTO purchases (
        user_id, note_id, course_id, amount, payment_status, purchased_at
      ) VALUES (?, ?, ?, ?, 'pending', NOW())`,
      [userId, noteId || null, courseId || null, amount]
    );
  },
  
  // Update purchase status
  updatePurchaseStatus: async (purchaseId, status) => {
    return db.query(
      'UPDATE purchases SET payment_status = ? WHERE id = ?',
      [status, purchaseId]
    );
  }
};

module.exports = purchaseQueries;

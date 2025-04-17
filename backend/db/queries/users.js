
const db = require('../db');

// User queries
const userQueries = {
  // Get all users
  getAllUsers: async (filters = {}) => {
    let query = 'SELECT id, name, email, role, created_at FROM users';
    const values = [];
    
    // Apply role filter if provided
    if (filters.role) {
      query += ' WHERE role = ?';
      values.push(filters.role);
    }
    
    // Add search filter if provided
    if (filters.search) {
      const whereClause = filters.role ? ' AND' : ' WHERE';
      query += `${whereClause} (name LIKE ? OR email LIKE ?)`;
      values.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    
    // Add sorting
    query += ' ORDER BY created_at DESC';
    
    return db.query(query, values);
  },
  
  // Get user by id
  getUserById: async (userId) => {
    return db.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [userId]);
  },
  
  // Get user by email
  getUserByEmail: async (email) => {
    return db.query('SELECT * FROM users WHERE email = ?', [email]);
  },
  
  // Create a new user
  createUser: async (userData) => {
    const { name, email, password, role } = userData;
    const result = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role || 'student']
    );
    return result;
  },
  
  // Update user
  updateUser: async (userId, updateData) => {
    const { name, email, password, role } = updateData;
    
    let updateFields = [];
    let updateValues = [];
    
    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    
    if (password) {
      updateFields.push('password = ?');
      updateValues.push(password);
    }
    
    if (role) {
      updateFields.push('role = ?');
      updateValues.push(role);
    }
    
    if (updateFields.length === 0) {
      return { affectedRows: 0 };
    }
    
    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    return db.query(query, [...updateValues, userId]);
  },
  
  // Delete user
  deleteUser: async (userId) => {
    return db.query('DELETE FROM users WHERE id = ?', [userId]);
  }
};

module.exports = userQueries;

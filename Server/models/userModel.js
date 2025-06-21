import db from '../config/database.js';

class User {
  // Get all users
  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM users');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get user by ID
  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Get user by email
  static async getByEmail(email) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Create new user
  static async create({ name, email, password, role = 'student' }) {
    try {
      // Validate required fields
      if (!name || !email || !password) {
        throw new Error('Name, email, and password are required');
      }

      // Validate role
      if (role !== 'student' && role !== 'teacher') {
        throw new Error('Role must be either "student" or "teacher"');
      }

      const [result] = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, password, role]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Update user
  static async update(id, { name, email, password, role }) {
    try {
      // Build dynamic query based on provided fields
      const updates = [];
      const values = [];

      if (name !== undefined) {
        updates.push('name = ?');
        values.push(name);
      }
      
      if (email !== undefined) {
        updates.push('email = ?');
        values.push(email);
      }
      
      if (password !== undefined) {
        updates.push('password = ?');
        values.push(password);
      }
      
      if (role !== undefined) {
        // Validate role
        if (role !== 'student' && role !== 'teacher') {
          throw new Error('Role must be either "student" or "teacher"');
        }
        updates.push('role = ?');
        values.push(role);
      }

      if (updates.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);
      
      const [result] = await db.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get users by role
  static async getByRole(role) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE role = ?', [role]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

export default User;
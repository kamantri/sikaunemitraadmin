import db from '../config/database.js';

class Admin {
  // Get all admins
  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM admin');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get admin by ID
  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM admin WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Get admin by email
  static async getByEmail(email) {
    try {
      const [rows] = await db.query('SELECT * FROM admin WHERE email = ?', [email]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Create new admin
  static async create({ name, email, password, role = 'admin' }) {
    try {
      // Validate required fields
      if (!name || !email || !password) {
        throw new Error('Name, email, and password are required');
      }

      const [result] = await db.query(
        'INSERT INTO admin (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, password, role]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Update admin
  static async update(id, { name, email, password }) {
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

      if (updates.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);
      
      const [result] = await db.query(
        `UPDATE admin SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete admin
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM admin WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

export default Admin;
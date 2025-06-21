import db from '../config/database.js';

class Offer {
  // Get all offers
  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM offers');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get offer by ID
  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM offers WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Create new offer
  static async create({ 
    title = null, description = null, discount_percent = null, 
    valid_from = null, valid_until = null, status = 'active' 
  }) {
    try {
      // Validate status if provided
      if (status && !['active', 'expired'].includes(status)) {
        throw new Error('Status must be active or expired');
      }

      const [result] = await db.query(
        `INSERT INTO offers (
          title, description, discount_percent, valid_from, valid_until, status
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          title, description, discount_percent, valid_from, valid_until, status
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Update offer
  static async update(id, { 
    title, description, discount_percent, valid_from, valid_until, status
  }) {
    try {
      // Build dynamic query based on provided fields
      const updates = [];
      const values = [];

      if (title !== undefined) {
        updates.push('title = ?');
        values.push(title);
      }
      
      if (description !== undefined) {
        updates.push('description = ?');
        values.push(description);
      }
      
      if (discount_percent !== undefined) {
        updates.push('discount_percent = ?');
        values.push(discount_percent);
      }
      
      if (valid_from !== undefined) {
        updates.push('valid_from = ?');
        values.push(valid_from);
      }
      
      if (valid_until !== undefined) {
        updates.push('valid_until = ?');
        values.push(valid_until);
      }
      
      if (status !== undefined) {
        // Validate status
        if (status && !['active', 'expired'].includes(status)) {
          throw new Error('Status must be active or expired');
        }
        updates.push('status = ?');
        values.push(status);
      }

      if (updates.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);
      
      const [result] = await db.query(
        `UPDATE offers SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete offer
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM offers WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get active offers
  static async getActiveOffers() {
    try {
      const [rows] = await db.query('SELECT * FROM offers WHERE status = "active" AND valid_until >= CURDATE()');
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

export default Offer;
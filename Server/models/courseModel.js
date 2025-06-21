import db from '../config/database.js';

class Course {
  // Get all courses
  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM courses');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get course by ID
  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM courses WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Create new course
  static async create({ 
    title, description, price = 0, category = null, duration = null, 
    level = null, image_url = null, status = 'coming soon', created_by = null 
  }) {
    try {
      // Validate required fields
      if (!title || !description) {
        throw new Error('Title and description are required');
      }

      // Validate status if provided
      if (status && !['available', 'not available', 'coming soon'].includes(status)) {
        throw new Error('Status must be available, not available, or coming soon');
      }

      const [result] = await db.query(
        `INSERT INTO courses (
          title, description, price, category, duration, 
          level, image_url, status, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title, description, price, category, duration,
          level, image_url, status, created_by
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Update course
  static async update(id, { 
    title, description, price, category, duration,
    level, image_url, status, created_by
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
      
      if (price !== undefined) {
        updates.push('price = ?');
        values.push(price);
      }
      
      if (category !== undefined) {
        updates.push('category = ?');
        values.push(category);
      }
      
      if (duration !== undefined) {
        updates.push('duration = ?');
        values.push(duration);
      }
      
      if (level !== undefined) {
        updates.push('level = ?');
        values.push(level);
      }
      
      if (image_url !== undefined) {
        updates.push('image_url = ?');
        values.push(image_url);
      }
      
      if (status !== undefined) {
        // Validate status
        if (status && !['available', 'not available', 'coming soon'].includes(status)) {
          throw new Error('Status must be available, not available, or coming soon');
        }
        updates.push('status = ?');
        values.push(status);
      }
      
      if (created_by !== undefined) {
        updates.push('created_by = ?');
        values.push(created_by);
      }

      if (updates.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);
      
      const [result] = await db.query(
        `UPDATE courses SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete course
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM courses WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get courses by category
  static async getByCategory(category) {
    try {
      const [rows] = await db.query('SELECT * FROM courses WHERE category = ?', [category]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get courses by status
  static async getByStatus(status) {
    try {
      const [rows] = await db.query('SELECT * FROM courses WHERE status = ?', [status]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get courses by creator
  static async getByCreator(createdBy) {
    try {
      const [rows] = await db.query('SELECT * FROM courses WHERE created_by = ?', [createdBy]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

export default Course;
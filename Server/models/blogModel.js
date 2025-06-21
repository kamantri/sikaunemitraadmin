import db from '../config/database.js';

class Blog {
  // Get all blogs
  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM blogs');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get blog by ID
  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM blogs WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Create new blog
  static async create({ 
    title, content = null, featured_image = null, 
    status = 'draft', author_id = null, created_by = null 
  }) {
    try {
      // Validate required fields
      if (!title) {
        throw new Error('Title is required');
      }

      // Validate status if provided
      if (status && !['draft', 'published', 'archived'].includes(status)) {
        throw new Error('Status must be draft, published, or archived');
      }

      const [result] = await db.query(
        `INSERT INTO blogs (
          title, content, featured_image, status, author_id, created_by
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          title, content, featured_image, status, author_id, created_by
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Update blog
  static async update(id, { 
    title, content, featured_image, status, author_id, created_by
  }) {
    try {
      // Build dynamic query based on provided fields
      const updates = [];
      const values = [];

      if (title !== undefined) {
        updates.push('title = ?');
        values.push(title);
      }
      
      if (content !== undefined) {
        updates.push('content = ?');
        values.push(content);
      }
      
      if (featured_image !== undefined) {
        updates.push('featured_image = ?');
        values.push(featured_image);
      }
      
      if (status !== undefined) {
        // Validate status
        if (status && !['draft', 'published', 'archived'].includes(status)) {
          throw new Error('Status must be draft, published, or archived');
        }
        updates.push('status = ?');
        values.push(status);
      }
      
      if (author_id !== undefined) {
        updates.push('author_id = ?');
        values.push(author_id);
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
        `UPDATE blogs SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete blog
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM blogs WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get blogs by status
  static async getByStatus(status) {
    try {
      const [rows] = await db.query('SELECT * FROM blogs WHERE status = ?', [status]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get blogs by author
  static async getByAuthor(authorId) {
    try {
      const [rows] = await db.query('SELECT * FROM blogs WHERE author_id = ?', [authorId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

export default Blog;
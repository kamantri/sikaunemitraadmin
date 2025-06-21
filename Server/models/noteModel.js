import db from '../config/database.js';

class Note {
  // Get all notes
  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM notes');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get note by ID
  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM notes WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Create new note
  static async create({ 
    title, content = null, category = null, grade = null, subject = null,
    price = 0, file_url = null, file_type = null, pinned = false,
    available = true, created_by = null
  }) {
    try {
      // Validate required fields
      if (!title) {
        throw new Error('Title is required');
      }

      const [result] = await db.query(
        `INSERT INTO notes (
          title, content, category, grade, subject, price, file_url,
          file_type, pinned, available, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title, content, category, grade, subject, price, file_url,
          file_type, pinned, available, created_by
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Update note
  static async update(id, { 
    title, content, category, grade, subject, price,
    file_url, file_type, pinned, available, created_by
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
      
      if (category !== undefined) {
        updates.push('category = ?');
        values.push(category);
      }
      
      if (grade !== undefined) {
        updates.push('grade = ?');
        values.push(grade);
      }
      
      if (subject !== undefined) {
        updates.push('subject = ?');
        values.push(subject);
      }
      
      if (price !== undefined) {
        updates.push('price = ?');
        values.push(price);
      }
      
      if (file_url !== undefined) {
        updates.push('file_url = ?');
        values.push(file_url);
      }
      
      if (file_type !== undefined) {
        updates.push('file_type = ?');
        values.push(file_type);
      }
      
      if (pinned !== undefined) {
        updates.push('pinned = ?');
        values.push(pinned);
      }
      
      if (available !== undefined) {
        updates.push('available = ?');
        values.push(available);
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
        `UPDATE notes SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete note
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM notes WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get notes by subject
  static async getBySubject(subject) {
    try {
      const [rows] = await db.query('SELECT * FROM notes WHERE subject = ?', [subject]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get notes by category
  static async getByCategory(category) {
    try {
      const [rows] = await db.query('SELECT * FROM notes WHERE category = ?', [category]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get pinned notes
  static async getPinnedNotes() {
    try {
      const [rows] = await db.query('SELECT * FROM notes WHERE pinned = TRUE');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get available notes
  static async getAvailableNotes() {
    try {
      const [rows] = await db.query('SELECT * FROM notes WHERE available = TRUE');
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

export default Note;
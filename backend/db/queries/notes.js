
const db = require('../db');

// Notes queries
const noteQueries = {
  // Get all notes with optional filtering
  getAllNotes: async (filters = {}) => {
    const { category, grade, subject, search } = filters;
    
    let query = `
      SELECT n.*, GROUP_CONCAT(nt.topic) AS topics
      FROM notes n
      LEFT JOIN note_topics nt ON n.id = nt.note_id
    `;
    
    const whereConditions = [];
    const queryParams = [];
    
    if (category) {
      whereConditions.push('n.category = ?');
      queryParams.push(category);
    }
    
    if (grade) {
      whereConditions.push('n.grade = ?');
      queryParams.push(grade);
    }
    
    if (subject) {
      whereConditions.push('n.subject = ?');
      queryParams.push(subject);
    }
    
    if (search) {
      whereConditions.push('(n.title LIKE ? OR n.content LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    
    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    query += ' GROUP BY n.id ORDER BY n.pinned DESC, n.created_at DESC';
    
    return db.query(query, queryParams);
  },
  
  // Get note by id
  getNoteById: async (noteId) => {
    return db.query(`
      SELECT n.*, GROUP_CONCAT(nt.topic) AS topics
      FROM notes n
      LEFT JOIN note_topics nt ON n.id = nt.note_id
      WHERE n.id = ?
      GROUP BY n.id
    `, [noteId]);
  },
  
  // Create a new note
  createNote: async (noteData) => {
    const { title, content, category, grade, subject, price, fileUrl, fileType, userId } = noteData;
    
    const result = await db.query(
      `INSERT INTO notes (
        title, content, category, grade, subject, price, file_url, file_type, 
        created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [title, content, category, grade, subject, price || 0, fileUrl, fileType, userId]
    );
    
    return result;
  },
  
  // Update a note
  updateNote: async (noteId, noteData) => {
    const { title, content, category, grade, subject, price, fileUrl, fileType } = noteData;
    
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
    
    if (category) {
      updateFields.push('category = ?');
      updateValues.push(category);
    }
    
    if (grade) {
      updateFields.push('grade = ?');
      updateValues.push(grade);
    }
    
    if (subject) {
      updateFields.push('subject = ?');
      updateValues.push(subject);
    }
    
    if (price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(price);
    }
    
    if (fileUrl) {
      updateFields.push('file_url = ?');
      updateValues.push(fileUrl);
      
      updateFields.push('file_type = ?');
      updateValues.push(fileType);
    }
    
    updateFields.push('updated_at = NOW()');
    
    const query = `UPDATE notes SET ${updateFields.join(', ')} WHERE id = ?`;
    return db.query(query, [...updateValues, noteId]);
  },
  
  // Toggle pin status
  togglePinStatus: async (noteId) => {
    return db.query('UPDATE notes SET pinned = NOT pinned WHERE id = ?', [noteId]);
  },
  
  // Toggle availability
  toggleAvailability: async (noteId) => {
    return db.query('UPDATE notes SET available = NOT available WHERE id = ?', [noteId]);
  },
  
  // Delete a note
  deleteNote: async (noteId) => {
    return db.query('DELETE FROM notes WHERE id = ?', [noteId]);
  },
  
  // Add topic to note
  addNoteTopic: async (noteId, topic) => {
    return db.query('INSERT INTO note_topics (note_id, topic) VALUES (?, ?)', [noteId, topic]);
  },
  
  // Delete all topics for a note
  deleteNoteTopics: async (noteId) => {
    return db.query('DELETE FROM note_topics WHERE note_id = ?', [noteId]);
  }
};

module.exports = noteQueries;

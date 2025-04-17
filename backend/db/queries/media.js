
const db = require('../db');

// Media queries
const mediaQueries = {
  // Get all media files with optional filtering
  getAllMedia: async (filters = {}) => {
    const { search, type, userId } = filters;
    
    let query = `
      SELECT m.*, u.name as uploader_name
      FROM media m
      LEFT JOIN users u ON m.uploaded_by = u.id
    `;
    
    const whereConditions = [];
    const queryParams = [];
    
    if (search) {
      whereConditions.push('m.file_name LIKE ?');
      queryParams.push(`%${search}%`);
    }
    
    if (type) {
      whereConditions.push('m.file_type LIKE ?');
      queryParams.push(`%${type}%`);
    }
    
    if (userId) {
      whereConditions.push('m.uploaded_by = ?');
      queryParams.push(userId);
    }
    
    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    query += ' ORDER BY m.created_at DESC';
    
    return db.query(query, queryParams);
  },
  
  // Get media by id
  getMediaById: async (mediaId) => {
    return db.query(`
      SELECT m.*, u.name as uploader_name
      FROM media m
      LEFT JOIN users u ON m.uploaded_by = u.id
      WHERE m.id = ?
    `, [mediaId]);
  },
  
  // Create a new media entry
  createMedia: async (mediaData) => {
    const { fileName, filePath, fileType, fileSize, userId } = mediaData;
    
    const result = await db.query(
      'INSERT INTO media (file_name, file_path, file_type, file_size, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [fileName, filePath, fileType, fileSize, userId]
    );
    
    return result;
  },
  
  // Delete a media entry
  deleteMedia: async (mediaId) => {
    return db.query('DELETE FROM media WHERE id = ?', [mediaId]);
  }
};

module.exports = mediaQueries;

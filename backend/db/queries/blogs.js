
const db = require('../index');

// Blogs queries
const blogQueries = {
  // Get all blogs with optional filtering
  getAllBlogs: async (filters = {}) => {
    const { search, status, authorId } = filters;
    
    let query = `
      SELECT b.*, u.name as author_name 
      FROM blogs b 
      LEFT JOIN users u ON b.author_id = u.id
    `;
    
    const whereConditions = [];
    const queryParams = [];
    
    if (search) {
      whereConditions.push('(b.title LIKE ? OR b.content LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    
    if (status) {
      whereConditions.push('b.status = ?');
      queryParams.push(status);
    }
    
    if (authorId) {
      whereConditions.push('b.author_id = ?');
      queryParams.push(authorId);
    }
    
    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    query += ' ORDER BY b.created_at DESC';
    
    return db.query(query, queryParams);
  },
  
  // Get blog by id
  getBlogById: async (blogId) => {
    return db.query(`
      SELECT b.*, u.name as author_name 
      FROM blogs b 
      LEFT JOIN users u ON b.author_id = u.id
      WHERE b.id = ?
    `, [blogId]);
  },
  
  // Create a new blog
  createBlog: async (blogData) => {
    const { title, content, featured_image, status, authorId } = blogData;
    
    const result = await db.query(
      `INSERT INTO blogs (
        title, content, featured_image, status, author_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [title, content, featured_image, status || 'draft', authorId]
    );
    
    return result;
  },
  
  // Update a blog
  updateBlog: async (blogId, blogData) => {
    const { title, content, featured_image, status } = blogData;
    
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
    
    if (featured_image) {
      updateFields.push('featured_image = ?');
      updateValues.push(featured_image);
    }
    
    if (status) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    
    updateFields.push('updated_at = NOW()');
    
    const query = `UPDATE blogs SET ${updateFields.join(', ')} WHERE id = ?`;
    return db.query(query, [...updateValues, blogId]);
  },
  
  // Delete a blog
  deleteBlog: async (blogId) => {
    return db.query('DELETE FROM blogs WHERE id = ?', [blogId]);
  }
};

module.exports = blogQueries;

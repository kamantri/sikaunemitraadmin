export const authService = {
  login: async (credentials) => {
    try {
      // ... existing login logic ...
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
      
      // Store token in database
      await db.query(
        'INSERT INTO tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [user.id, token, new Date(Date.now() + 24 * 60 * 60 * 1000)]
      );
      
      return { token, user };
    } catch (error) {
      // ... error handling ...
    }
  },
  
  validateToken: async (token) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM tokens WHERE token = ? AND expires_at > NOW()',
        [token]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
};
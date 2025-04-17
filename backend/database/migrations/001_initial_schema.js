const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function up() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    // Drop existing database if exists
    await connection.query('DROP DATABASE IF EXISTS sikaunemitra');
    
    // Read and execute the SQL file
    const sqlPath = path.join(__dirname, '../../db-init.sql');
    const sqlContent = await fs.readFile(sqlPath, 'utf8');
    const queries = sqlContent.split(';').filter(query => query.trim());

    for (const query of queries) {
      if (query.trim()) {
        await connection.query(query);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

module.exports = { up };
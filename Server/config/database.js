import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sikaunemitra',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const testConnection = async () => {
  try {
    // First try to connect without database to check server connection
    const tempPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    const conn = await tempPool.getConnection();
    
    // Create database if it doesn't exist
    await conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    conn.release();
    await tempPool.end();

    // Test main connection
    const mainConn = await pool.getConnection();
    console.log('✅ Database connected successfully');
    mainConn.release();
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('Please check:');
    console.error('1. MySQL server is running');
    console.error('2. Database credentials are correct');
    process.exit(1); // Exit if database connection fails
  }
};

testConnection();

export default pool;

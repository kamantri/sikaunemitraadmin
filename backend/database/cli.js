require('dotenv').config();
const mysql = require('mysql2/promise');

async function runMigrations() {
  const migration = require('./migrations/001_initial_schema');
  await migration.up();
}

async function runSeeders() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'sikaunemitra'
  });

  const seeder = require('./seeders/001_demo_data');
  await seeder.seed(connection);
  await connection.end();
}

const command = process.argv[2];

async function main() {
  try {
    if (command === 'migrate') {
      await runMigrations();
    } else if (command === 'seed') {
      await runSeeders();
    } else if (command === 'refresh') {
      await runMigrations();
      await runSeeders();
    } else {
      console.log('Available commands: migrate, seed, refresh');
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
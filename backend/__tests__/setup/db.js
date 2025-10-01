// tests/setup/db.js
const mysql = require('mysql2/promise');

let connection;

async function connect() {
  connection = await mysql.createConnection({
    host: 'localhost',
    user: 'your_test_user',
    password: 'your_password',
    database: 'your_test_db',
  });
}

async function resetDatabase() {
  // Clear necessary tables or insert test fixtures
  await connection.query('DELETE FROM users');
  await connection.query('DELETE FROM products');
  // Or run SQL script to reset database
}

async function close() {
  await connection.end();
}

module.exports = {
  connect,
  resetDatabase,
  close,
  getConnection: () => connection,
};

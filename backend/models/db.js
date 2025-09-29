let mysql = require('mysql');

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return; // Return to stop further execution
  }
  console.log(`Connected to the MySQL server on ${process.env.DB_HOST}:${process.env.DB_PORT}.`);
});

module.exports = connection;

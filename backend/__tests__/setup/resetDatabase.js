// const mysql = require('mysql2/promise');
// require('dotenv').config(); // Load environment variables

// let connection;

// beforeAll(async () => {
//   try {
//     connection = await mysql.createConnection({
//       host: process.env.DB_HOST,
//       port: process.env.DB_PORT,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASS,
//       database: process.env.TEST_DB_NAME,
//     });
//     console.log(`Connected to the MySQL server on port ${process.env.DB_PORT}.`);
//   } catch (err) {
//     console.log('Error connecting to the database:', err.message);
//     process.exit(1);
//   }
// });

// beforeEach(async () => {
//   console.log("Resetting database before test...");

//   try {
//     await connection.query('SET FOREIGN_KEY_CHECKS = 0');
//     await connection.query('TRUNCATE TABLE Interest_bridge');
//     await connection.query('TRUNCATE TABLE Product');
//     await connection.query('TRUNCATE TABLE Rating');
//     await connection.query('TRUNCATE TABLE Seller');
//     await connection.query('TRUNCATE TABLE Transaction');
//     await connection.query('TRUNCATE TABLE User');
//     await connection.query('SET FOREIGN_KEY_CHECKS = 1');
//   } catch (error) {
//     console.error("Error resetting database:", error.message);
//     throw error; // Fail the test setup if database reset fails
//   }
// });

// afterAll(async () => {
//   try {
//     await connection.end();
//     console.log("Database connection closed.");
//   } catch (err) {
//     console.error("Error closing database connection:", err.message);
//   }
// });

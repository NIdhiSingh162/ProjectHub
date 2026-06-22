const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.log("MySQL Connection Failed:", err);
  } else {
    console.log("MySQL Connected Successfully");

    console.log("Database Name:", process.env.DB_NAME);
    console.log("Database Host:", process.env.DB_HOST);

    // Users Table
    db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(100),
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Projects Table
    db.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tasks Table
    db.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT,
        title VARCHAR(255),
        description TEXT,
        assigned_to VARCHAR(100),
        priority VARCHAR(20),
        status VARCHAR(50),
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Agar table pehle se hai to due_date add kar dega
    db.query(
      "ALTER TABLE tasks ADD COLUMN due_date DATE",
      (err) => {
        if (err && err.code !== "ER_DUP_FIELDNAME") {
          console.log("due_date column error:", err);
        } else {
          console.log("due_date column checked/created successfully");
        }
      }
    );
  }
});

module.exports = db;
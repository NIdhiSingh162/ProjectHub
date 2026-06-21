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
  }
});

module.exports = db;
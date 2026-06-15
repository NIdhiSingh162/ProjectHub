const db = require("../db");

const registerUser = (req, res) => {
  const { name, email, password } = req.body;

  const sql =
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "User Registered Successfully",
    });
  });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql =
    "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length > 0) {
      res.json({
        message: "Login Successful",
        user: result[0],
      });
    } else {
      res.status(401).json({
        message: "Invalid Email or Password",
      });
    }
  });
};

module.exports = {
  registerUser,
  loginUser,
};
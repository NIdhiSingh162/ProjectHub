const db = require("../db");

const createProject = (req, res) => {
  const { title, description, created_by } = req.body;

  const sql =
    "INSERT INTO projects (title, description, created_by) VALUES (?, ?, ?)";

  db.query(sql, [title, description, created_by], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Project Created Successfully",
    });
  });
};

const getProjects = (req, res) => {
  const sql = "SELECT * FROM projects ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

const deleteProject = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM projects WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Project Deleted Successfully",
      });
    }
  );
};


module.exports = {
  createProject,
  getProjects,
  deleteProject,
};
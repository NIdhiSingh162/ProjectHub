const db = require("../db");

const createTask = (req, res) => {
  const {
    project_id,
    title,
    description,
    assigned_to,
    status,
    priority,
    due_date,
  } = req.body;

  const sql = `
  INSERT INTO tasks
  (project_id,title,description,assigned_to,status,priority,due_date)
  VALUES (?,?,?,?,?,?,?)
  `;

  db.query(
    sql,
    [
      project_id,
      title,
      description,
      assigned_to,
      status,
      priority,
      due_date,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Task Created Successfully",
      });
    }
  );
};

const getTasks = (req, res) => {
  const sql = "SELECT * FROM tasks ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

const updateTaskStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = "UPDATE tasks SET status = ? WHERE id = ?";

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Task Status Updated Successfully",
    });
  });
};

const deleteTask = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM tasks WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Task Deleted Successfully",
    });
  });
};

module.exports = {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
};
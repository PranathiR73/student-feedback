import express from "express";
import db from "../db.js";

const router = express.Router();

// GET all faculty
router.get("/faculty", (req, res) => {
  db.query("SELECT * FROM faculty", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ADD faculty
router.post("/faculty", (req, res) => {
  const { name, email, department } = req.body;

  if (!name || !email || !department) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const password_hash = "12345";

  db.query(
    "INSERT INTO faculty (name, email, department, password_hash) VALUES (?, ?, ?, ?)",
    [name, email, department, password_hash],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        message: "Faculty added",
        facultyId: results.insertId,
      });
    }
  );
});

// GET all courses
router.get("/courses", (req, res) => {
  db.query(
    `SELECT c.*, f.name AS faculty_name
     FROM courses c
     LEFT JOIN faculty f ON c.faculty_id = f.faculty_id`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// ADD course
router.post("/courses", (req, res) => {
  const { courseId, courseName, semester, courseType, facultyId } = req.body;

  if (!courseId || !courseName || !semester || !courseType || !facultyId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(
    `INSERT INTO courses (course_id, course_name, semester, course_type, faculty_id)
     VALUES (?, ?, ?, ?, ?)`,
    [courseId, courseName, semester, courseType.toLowerCase(), facultyId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Course added" });
    }
  );
});

// CHANGE faculty assigned to a course
router.put("/courses/:courseId/faculty", (req, res) => {
  const { courseId } = req.params;
  const { newFacultyId } = req.body;

  if (!newFacultyId) {
    return res.status(400).json({ error: "New faculty ID is required" });
  }

  db.query(
    "UPDATE courses SET faculty_id = ? WHERE course_id = ?",
    [newFacultyId, courseId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Course not found" });
      }

      res.json({ message: "Faculty updated for course" });
    }
  );
});

// GET course-only feedback rating
router.get("/courses/:courseId/rating", (req, res) => {
  const { courseId } = req.params;

  db.query(
    `SELECT
       COUNT(*) AS total_feedbacks,
       ROUND(SUM(q1 + q2 + q3 + q4 + q5) / (COUNT(*) * 5), 2) AS average_rating
     FROM feedback_course
     WHERE course_id = ?`,
    [courseId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        average_rating: results[0]?.average_rating || 0,
        total_feedbacks: results[0]?.total_feedbacks || 0,
      });
    }
  );
});

export default router;

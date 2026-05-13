const express = require("express");
const router = express.Router();
const db = require("../db"); // your MySQL connection

// -------------------- ADMIN DASHBOARD -------------------- //

// Get all faculty
router.get("/faculty", (req, res) => {
  const query = "SELECT * FROM faculty";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get all courses
router.get("/courses", (req, res) => {
  const query = "SELECT * FROM courses";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add new faculty
router.post("/faculty", (req, res) => {
  const { name, email, department } = req.body;
  if (!name || !email || !department) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const password_hash = `hash_${name.split(" ")[0].toLowerCase()}123`;

  const query = "INSERT INTO faculty (name, email, department, password_hash) VALUES (?, ?, ?, ?)";
  db.query(query, [name, email, department, password_hash], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Faculty added", facultyId: results.insertId });
  });
});

// Add new course
router.post("/courses", (req, res) => {
  const { courseId, courseName, semester, courseType, facultyId } = req.body;
  if (!courseId || !courseName || !semester || !courseType || !facultyId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = "INSERT INTO courses (course_id, course_name, semester, course_type, faculty_id) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [courseId, courseName, semester, courseType.toLowerCase(), facultyId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Course added" });
  });
});

// Change faculty of a course
router.put("/courses/:courseId/faculty", (req, res) => {
  const { courseId } = req.params;
  const { newFacultyId } = req.body;
  const query = "UPDATE courses SET faculty_id = ? WHERE course_id = ?";
  db.query(query, [newFacultyId, courseId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Faculty updated for course" });
  });
});

// Get course rating
router.get("/courses/:courseId/rating", (req, res) => {
  const { courseId } = req.params;
  db.query("CALL get_avg_rating_course(?)", [courseId], (err, results) => {
    if (err) {
      console.error("Error fetching theory courses:", err);
      return res.status(500).json({ error: "DB error" });
    }

    const rating = results[0][0]?.avg_rating || 0;
    const totalFeedbacks = results[0][0]?.total_feedbacks || 0;
    res.json({ average_rating: rating, total_feedbacks: totalFeedbacks});
  });
});

module.exports = router;
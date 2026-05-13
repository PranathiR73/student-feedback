import express from "express";
import db from "../db.js";

const router = express.Router();

// GET theory courses taught by a faculty member
router.get("/theory-courses/:facultyId", (req, res) => {
  const { facultyId } = req.params;

  db.query("CALL get_theory_courses_by_faculty(?)", [facultyId], (err, results) => {
    if (err) {
      console.error("Error fetching theory courses:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results[0]);
  });
});

// GET practical courses taught by a faculty member
router.get("/practical-courses/:facultyId", (req, res) => {
  const { facultyId } = req.params;

  db.query("CALL get_practical_courses_by_faculty(?)", [facultyId], (err, results) => {
    if (err) {
      console.error("Error fetching practical courses:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results[0]);
  });
});

// GET average theory rating for one faculty/course pair
router.get("/avg-theory-rating/:facultyId/:courseId", (req, res) => {
  const { facultyId, courseId } = req.params;

  db.query("CALL get_avg_rating_theory(?, ?)", [facultyId, courseId], (err, results) => {
    if (err) {
      console.error("Error fetching average theory rating:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      average_rating: results[0][0]?.avg_rating || 0,
      total_feedbacks: results[0][0]?.total_feedbacks || 0,
    });
  });
});

// GET average practical rating for one faculty/course pair
router.get("/avg-practical-rating/:facultyId/:courseId", (req, res) => {
  const { facultyId, courseId } = req.params;

  db.query("CALL get_avg_rating_practical(?, ?)", [facultyId, courseId], (err, results) => {
    if (err) {
      console.error("Error fetching average practical rating:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      average_rating: results[0][0]?.avg_rating || 0,
      total_feedbacks: results[0][0]?.total_feedbacks || 0,
    });
  });
});

export default router;

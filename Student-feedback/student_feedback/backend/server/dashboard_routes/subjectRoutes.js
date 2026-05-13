import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/semester/:semester', async (req, res) => {
  const semester = req.params.semester;

  try {
    const [rows] = await db.promise().query('CALL get_courses_by_semester(?)', [semester]);

    const theory = [];
    const practical = [];

    rows[0].forEach(course => {
      if (course.course_type === 'theory') theory.push(course);
      else if (course.course_type === 'practical') practical.push(course);
    });

    res.json({ theory, practical });
  } catch (err) {
    console.error("Error fetching semester courses:", err);
    res.status(500).json({ message: "Database error" });
  }
});

export default router;
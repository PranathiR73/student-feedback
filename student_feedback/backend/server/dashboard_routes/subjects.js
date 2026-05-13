import express from "express";
import db from "../db.js";

const router = express.Router();

const splitCoursesByType = (courses) => {
  const theory = [];
  const practical = [];

  courses.forEach((course) => {
    const courseType = String(course.course_type || "").toLowerCase();

    if (courseType === "theory") {
      theory.push(course);
    } else if (courseType === "practical") {
      practical.push(course);
    }
  });

  return { theory, practical };
};

const getCoursesBySemesterQuery = `
  SELECT
    c.course_id,
    c.course_name,
    f.name AS faculty_name,
    f.faculty_id,
    c.course_type,
    c.semester
  FROM courses c
  LEFT JOIN faculty f ON c.faculty_id = f.faculty_id
  WHERE c.semester = ?
`;

// Fetch subjects by semester.
router.get("/semester/:semester", async (req, res) => {
  const semester = Number(req.params.semester);

  if (!Number.isInteger(semester) || semester < 1 || semester > 8) {
    return res.status(400).json({ message: "Semester must be between 1 and 8" });
  }

  try {
    const [rows] = await db.promise().query("CALL get_courses_by_semester(?)", [semester]);
    return res.json(splitCoursesByType(rows[0] || []));
  } catch (procedureError) {
    console.warn(
      "Stored procedure get_courses_by_semester failed. Falling back to direct query.",
      procedureError.message
    );

    try {
      const [rows] = await db.promise().query(getCoursesBySemesterQuery, [semester]);
      return res.json(splitCoursesByType(rows));
    } catch (queryError) {
      console.error("Error fetching semester courses:", queryError);
      return res.status(500).json({ message: "Database error" });
    }
  }
});

export default router;

import express from "express";
const router = express.Router();
import db from "../db.js";

// Route to view a student's submitted feedback history
router.get("/feedback-history/:studentId", async (req, res) => {
  const studentId = Number(req.params.studentId);

  if (!Number.isInteger(studentId)) {
    return res.status(400).json({ message: "Invalid student ID" });
  }

  try {
    const [rows] = await db.promise().query(
      `
      SELECT
        ft.feedback_id,
        'theory' AS form_type,
        ft.student_id,
        ft.course_id,
        c.course_name,
        ft.faculty_id,
        f.name AS faculty_name,
        ft.semester,
        ft.year,
        ROUND((ft.q1 + ft.q2 + ft.q3 + ft.q4 + ft.q5 + ft.q6 + ft.q7 + ft.q8 + ft.q9 + ft.q10) / 10, 2) AS average_rating,
        ft.comments,
        ft.submitted_at
      FROM feedback_theory ft
      JOIN courses c ON ft.course_id = c.course_id
      JOIN faculty f ON ft.faculty_id = f.faculty_id
      WHERE ft.student_id = ?

      UNION ALL

      SELECT
        fp.feedback_id,
        'practical' AS form_type,
        fp.student_id,
        fp.course_id,
        c.course_name,
        fp.faculty_id,
        f.name AS faculty_name,
        fp.semester,
        fp.year,
        ROUND((fp.q1 + fp.q2 + fp.q3 + fp.q4 + fp.q5) / 5, 2) AS average_rating,
        fp.comments,
        fp.submitted_at
      FROM feedback_practical fp
      JOIN courses c ON fp.course_id = c.course_id
      JOIN faculty f ON fp.faculty_id = f.faculty_id
      WHERE fp.student_id = ?

      UNION ALL

      SELECT
        fc.feedback_id,
        'course' AS form_type,
        fc.student_id,
        fc.course_id,
        c.course_name,
        NULL AS faculty_id,
        NULL AS faculty_name,
        fc.semester,
        fc.year,
        ROUND((fc.q1 + fc.q2 + fc.q3 + fc.q4 + fc.q5) / 5, 2) AS average_rating,
        fc.comments,
        fc.submitted_at
      FROM feedback_course fc
      JOIN courses c ON fc.course_id = c.course_id
      WHERE fc.student_id = ?

      ORDER BY submitted_at DESC
      `,
      [studentId, studentId, studentId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching feedback history:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// Route to submit feedback
router.post("/submit-feedback", async (req, res) => {
  const {
    formType,
    student_id,
    faculty_id,
    course_id,
    semester,
    year,
    responses,
    comments,
  } = req.body;

  try {
    if (formType === "theory") {
      const result = await db.promise().query(
        `INSERT INTO feedback_theory 
        (student_id, faculty_id, course_id, semester, year,
         q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, comments) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          student_id,
          faculty_id,
          course_id,
          semester,
          year,
          responses[0],
          responses[1],
          responses[2],
          responses[3],
          responses[4],
          responses[5],
          responses[6],
          responses[7],
          responses[8],
          responses[9],
          comments,
        ]
      );
    } else if (formType === "practical") {
      const result = await db.promise().query(
        `INSERT INTO feedback_practical 
        (student_id, faculty_id, course_id, semester, year,
         q1, q2, q3, q4, q5, comments) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          student_id,
          faculty_id,
          course_id,
          semester,
          year,
          responses[0],
          responses[1],
          responses[2],
          responses[3],
          responses[4],
          comments,
        ]
      );
    } else if(formType==="course"){
      const result = await db.promise().query(
        `INSERT INTO feedback_course 
        (student_id, course_id, semester, year,
         q1, q2, q3, q4, q5, comments) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          student_id,
          course_id,
          semester,
          year,
          responses[0],
          responses[1],
          responses[2],
          responses[3],
          responses[4],
          comments,
        ]
      );
    }
    else {
      return res.status(400).json({ message: "Invalid formType" });
    }

    res.status(200).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    console.error("Error inserting feedback:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
});

export default  router;

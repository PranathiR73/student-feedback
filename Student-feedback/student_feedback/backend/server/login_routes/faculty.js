// routes/faculty.js
import express from "express";
const router = express.Router();
import db from "../db.js";

// POST /api/faculty/login
router.post("/login", (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  const query = "SELECT * FROM faculty WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length === 0) {
      return res.status(401).json({ message: "Email not found" });
    }

    const faculty = results[0];

    if (faculty.password_hash === password) {
      const { password_hash, ...facultyWithoutPassword } = faculty;
      return res.status(200).json({
        message: "Login successful",
        faculty: {
          ...facultyWithoutPassword,
          role: "faculty"
        }
      });
    } else {
      return res.status(401).json({ message: "Incorrect password" });
    }
  });
});

export default router;
// routes/student.js
import  express  from "express";
const router = express.Router();
import db from"../db.js";


// POST /api/student/login

router.post("/login", (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;
  const department = req.body.department;

  if (!email || !password || !department) {
    return res.status(400).json({ message: "Email, password, and department are required" });
  }

  const query = "SELECT * FROM students WHERE email = ? AND department = ?";
  db.query(query, [email, department], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length === 0) {
      return res.status(401).json({ message: "Student not found for selected department" });
    }

    const student = results[0];

    if (student.password_hash === password) {
      const { password_hash, ...studentWithoutPassword } = student;
      return res.status(200).json({ 
        message: "Login successful",
        student: {
            ...studentWithoutPassword,
            role:"student"
        } 
    });
    } else {
      return res.status(401).json({ message: "Incorrect password" });
    }
  });
});

export default router;

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import studentRoutes from "./login_routes/student.js";
import facultyRoutes from "./login_routes/faculty.js";
import adminRoutes from "./login_routes/admin.js";
import subjectRoutes from "./dashboard_routes/subjects.js";
import feedbackSubmitRoutes from "./dashboard_routes/feedbackSubmit.js";
import adminDashboardRoutes from "./dashboard_routes/adminDashboard.js";
import facultyDashboardRoutes from "./dashboard_routes/faculty.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/student", studentRoutes);
app.use("/api/student", subjectRoutes);
app.use("/api/student", feedbackSubmitRoutes);

app.use("/api/faculty", facultyRoutes);
app.use("/api/faculty", facultyDashboardRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminDashboardRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

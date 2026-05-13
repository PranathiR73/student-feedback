import express from 'express';
import adminRoutes from './admin.js';
import studentRoutes from './student.js';
import facultyRoutes from './faculty.js';

const router = express.Router();

// Combine all login-related routes
router.use('/admin', adminRoutes);
router.use('/student', studentRoutes);
router.use('/faculty', facultyRoutes);

export default router;
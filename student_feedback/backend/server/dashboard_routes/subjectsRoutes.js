// subjectsRoutes.js
import express from 'express';
const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.send('Subjects route is working!');
});

export default router;
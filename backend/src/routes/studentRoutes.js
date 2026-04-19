const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStats,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const { validateStudent } = require('../middleware/validate');

router.get('/', getStudents);
router.get('/stats', getStats);
router.get('/:id', getStudent);
router.post('/', protect, upload.single('image'), validateStudent, createStudent);
router.put('/:id', protect, upload.single('image'), validateStudent, updateStudent);
router.delete('/:id', protect, deleteStudent);

module.exports = router;

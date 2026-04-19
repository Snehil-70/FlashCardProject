const Student = require('../models/Student');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all students (search + filter + paginate + sort)
// @route   GET /api/students
// @access  Public
const getStudents = async (req, res, next) => {
  try {
    const { search, course, city, year, page = 1, limit = 9, sort = '-createdAt' } = req.query;

    const query = {};

    // Full-text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (course) query.course = { $regex: new RegExp(course, 'i') };
    if (city) query.city = { $regex: new RegExp(city, 'i') };
    if (year) query.year = Number(year);

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [students, total] = await Promise.all([
      Student.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'name email'),
      Student.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: students,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student stats
// @route   GET /api/students/stats
// @access  Public
const getStats = async (req, res, next) => {
  try {
    const [total, courses, cities] = await Promise.all([
      Student.countDocuments(),
      Student.distinct('course'),
      Student.distinct('city'),
    ]);

    res.json({
      success: true,
      data: {
        total,
        courses: courses.length,
        cities: cities.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Public
const getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('createdBy', 'name email');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// @desc    Create student
// @route   POST /api/students
// @access  Private
const createStudent = async (req, res, next) => {
  try {
    const { name, course, year, city, email, phone, bio } = req.body;

    const studentData = {
      name,
      course,
      year: Number(year),
      city,
      email,
      phone,
      bio,
      createdBy: req.user.id,
    };

    if (req.file) {
      studentData.image = req.file.path;
      studentData.imagePublicId = req.file.filename;
    }

    const student = await Student.create(studentData);

    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      data: student,
    });
  } catch (error) {
    // If duplicate email
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A student with this email already exists' });
    }
    next(error);
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const { name, course, year, city, email, phone, bio } = req.body;
    const updateData = { name, course, year: Number(year), city, email, phone, bio };

    // Handle new image upload
    if (req.file) {
      // Delete old image from Cloudinary
      if (student.imagePublicId) {
        await cloudinary.uploader.destroy(student.imagePublicId);
      }
      updateData.image = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }

    const updated = await Student.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Student updated successfully', data: updated });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A student with this email already exists' });
    }
    next(error);
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Delete image from Cloudinary
    if (student.imagePublicId) {
      await cloudinary.uploader.destroy(student.imagePublicId);
    }

    await student.deleteOne();

    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStudents, getStats, getStudent, createStudent, updateStudent, deleteStudent };

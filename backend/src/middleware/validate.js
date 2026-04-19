const { body, validationResult } = require('express-validator');

// Middleware to check validation results
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

// Register validation
const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').trim().isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation,
];

// Login validation
const validateLogin = [
  body('email').trim().isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

// Student validation
const validateStudent = [
  body('name').trim().notEmpty().withMessage('Student name is required').isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters'),
  body('course').trim().notEmpty().withMessage('Course is required'),
  body('year').isInt({ min: 1, max: 6 }).withMessage('Year must be between 1 and 6'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('email').trim().isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('phone').optional({ checkFalsy: true }).matches(/^[0-9]{10}$/).withMessage('Phone must be a valid 10-digit number'),
  body('bio').optional().isLength({ max: 300 }).withMessage('Bio cannot exceed 300 characters'),
  handleValidation,
];

module.exports = { validateRegister, validateLogin, validateStudent };

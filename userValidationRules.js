const { body } = require('express-validator');

// Validation schema
const userValidationRules = [
  // Username must be alphanumeric with minimum length 3 and maximum length 20
  body('username')
    .trim()
    .isAlphanumeric()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be alphanumeric with length between 3 and 20 characters'),

  // Email must be a valid email format
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address'),

  // Password must be at least 6 characters long
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

module.exports = userValidationRules;

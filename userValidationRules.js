const { body } = require('express-validator');

const sanitizedPattern = /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/;

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
    .matches(sanitizedPattern).withMessage('Password must contain only letters, numbers, and special characters @#$%^&+!=')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

module.exports = userValidationRules;



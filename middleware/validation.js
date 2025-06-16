// validation.js
const Joi = require('joi');
const { body, validationResult } = require('express-validator');

/* --------------------------------------------------
   ✅ JOI VALIDATION MIDDLEWARES
-------------------------------------------------- */

/**
 * Validate request body using Joi schema
 */
const validateBodyWithJoi = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation Error',
        details: errors
      });
    }

    next();
  };
};

/**
 * Validate query using Joi schema
 */
const validateQueryWithJoi = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation Error',
        details: errors
      });
    }

    next();
  };
};

/**
 * Validate params using Joi schema
 */
const validateParamsWithJoi = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation Error',
        details: errors
      });
    }

    next();
  };
};

/* --------------------------------------------------
   ✅ EXPRESS-VALIDATOR MIDDLEWARES
-------------------------------------------------- */

/**
 * Run after express-validator rules to return errors
 */
const handleValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

/* --------------------------------------------------
   ✨ EXPRESS VALIDATION RULES
-------------------------------------------------- */

/**
 * Registration validation rules
 */
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),

  handleValidationResult
];

/**
 * Login validation rules
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),

  handleValidationResult
];

/* --------------------------------------------------
   💾 EXPORT EVERYTHING
-------------------------------------------------- */

module.exports = {
  // Joi-based middleware
  validateBodyWithJoi,
  validateQueryWithJoi,
  validateParamsWithJoi,

  // Express-validator rules
  registerValidation,
  loginValidation
};

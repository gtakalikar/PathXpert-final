const Joi = require('joi');

// User validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  displayName: Joi.string().min(2).max(50).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const updateProfileSchema = Joi.object({
  displayName: Joi.string().min(2).max(50),
  photoURL: Joi.string().uri()
});

// Report validation schemas
const createReportSchema = Joi.object({
  type: Joi.string().valid('hazard', 'obstacle', 'construction', 'other').required(),
  location: Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: Joi.array().length(2).items(Joi.number()).required()
  }).required(),
  description: Joi.string().min(10).max(500).required(),
  severity: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium'),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().uri().required(),
      caption: Joi.string().max(100)
    })
  )
});

const updateReportSchema = Joi.object({
  type: Joi.string().valid('hazard', 'obstacle', 'construction', 'other'),
  location: Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: Joi.array().length(2).items(Joi.number())
  }),
  description: Joi.string().min(10).max(500),
  severity: Joi.string().valid('low', 'medium', 'high', 'critical'),
  status: Joi.string().valid('active', 'resolved', 'pending'),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().uri().required(),
      caption: Joi.string().max(100)
    })
  )
});

// Query validation schemas
const reportQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  type: Joi.string().valid('hazard', 'obstacle', 'construction', 'other'),
  status: Joi.string().valid('active', 'resolved', 'pending'),
  severity: Joi.string().valid('low', 'medium', 'high', 'critical'),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate'))
});

const userHistoryQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('active', 'resolved', 'pending'),
  type: Joi.string().valid('hazard', 'obstacle', 'construction', 'other')
});

// Parameter validation schemas
const idParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required()
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  createReportSchema,
  updateReportSchema,
  reportQuerySchema,
  userHistoryQuerySchema,
  idParamSchema
}; 
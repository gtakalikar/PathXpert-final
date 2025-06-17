const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// Use only require or only import — pick one style, I recommend require here for consistency:
const {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
  getReportOptions
} = require('../controllers/reportController');

// Route for getting report options
router.get('/report-options', getReportOptions);

// Other routes
router.post('/', auth, createReport); // Use createReport directly, no `reportController.` prefix
router.get('/', getReports);
router.get('/:id', getReportById);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);

module.exports = router;

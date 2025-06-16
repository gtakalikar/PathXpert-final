const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { 
  createReport, 
  getReports, 
  getReportById, 
  updateReport, 
  deleteReport 
} = require('../controllers/reportController');

// Create a new report
router.post('/', auth, createReport);

// Get all reports (with optional filtering)
router.get('/', auth, getReports);

// While other routes have auth
router.post('/', auth, createReport);
router.get('/:id', auth, getReportById);

// Update a report (admin can update status, users can only update their own)
router.put('/:id', auth, updateReport);

// Delete a report (admin can delete any, users can only delete their own)
router.delete('/:id', auth, deleteReport);

// Admin-only routes
router.get('/admin/all', auth, authorize('admin'), getReports);
router.put('/admin/:id/status', auth, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status;
    await report.save();

    res.json({
      message: 'Report status updated successfully',
      report
    });
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(500).json({ message: 'Server error while updating report status' });
  }
});

module.exports = router;

const Report = require('../models/Report');
const User = require('../models/User');

// Create a new report
const createReport = async (req, res) => {
  try {
    const { type, injured, location, description, anonymous } = req.body;

    const newReport = new Report({
      
      type,
      injured,
      location,
      description,
      anonymous,
      userId: req.user._id,  // ✅ correct here
      status: 'pending'
    });

    const savedReport = await newReport.save();

    res.status(201).json({
      message: 'Report created successfully!',
      report: savedReport
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Server error while creating report' });
  }
};

// Get all reports with pagination and filters
const getReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;
    const query = {};

    // Apply filters
    if (status) query.status = status;
    if (category) query.category = category;

    // If not admin, only show user's reports
    if (req.user.role !== 'admin') {
      query.userId = req.user._id; // Use req.user._id to get the current user's ID
    }

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Report.countDocuments(query);

    res.json({
      reports,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error while fetching reports' });
  }
};

// Get a single report by ID
const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this report' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: 'Server error while fetching report' });
  }
};

// Update a report
const updateReport = async (req, res) => {
  try {
    const { title, content, category, status } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this report' });
    }

    // Update fields
    if (title) report.title = title;
    if (content) report.content = content;
    if (category) report.category = category;
    if (status && (req.user.role === 'admin' || report.userId.toString() === req.user._id.toString())) {
      report.status = status;
    }

    await report.save();

    res.json({
      message: 'Report updated successfully',
      report
    });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ message: 'Server error while updating report' });
  }
};

// Delete a report
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this report' });
    }

    await report.deleteOne();

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Server error while deleting report' });
  }
};

module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport
}; 
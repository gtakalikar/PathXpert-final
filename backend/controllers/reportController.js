

const Report = require('../models/Report');
const User = require('../models/User');

// 📌 NEW: This fixes the crash for /report-options
const getReportOptions = (req, res) => {
  const options = [
    {
      type: 'accident',
      label: 'Accident',
      icon: 'car-sport',
      color: '#FF5F5F',
      bgColor: 'rgba(255, 95, 95, 0.15)',
    },
    {
      type: 'traffic',
      label: 'Traffic Jam',
      icon: 'trail-sign',
      color: '#FFD700',
      bgColor: 'rgba(255, 215, 0, 0.15)',
    },
    {
      type: 'closure',
      label: 'Road Closure',
      icon: 'close-circle',
      color: '#00B2FF',
      bgColor: 'rgba(0, 178, 255, 0.15)',
    },
    {
      type: 'other',
      label: 'Other',
      icon: 'ellipsis-horizontal-circle',
      color: '#00FFCC',
      bgColor: 'rgba(0, 255, 204, 0.15)',
    },
  ];

  res.status(200).json(options);
};

// 🧠 Existing CRUD logic below

const createReport = async (req, res) => {
  try {
    const { type, injured, location, description, anonymous } = req.body;

    const userId = req.user._id; 
    
      if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: user not found' });
    }
     // Validation: required fields
    if (!type || !location || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
     console.log('Creating report with:', { type, injured, location, description, anonymous, userId });

    const newReport = new Report({
      type,
      injured,
      location,
      description,
      anonymous,
      userId: req.user._id,
      status: 'pending'
    });

    const savedReport = await newReport.save();
    // ✨ Populate the userId field with user info (email, displayName)
    await savedReport.populate('userId', 'email displayName');

    res.status(201).json({
      message: 'Report created successfully!',
      report: savedReport
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Server error while creating report' });
  }
};

const getReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;

    if (req.user.role !== 'admin') {
      if (!req.user || !req.user._id) {
    return res.status(401).json({
      message: 'Unauthorized - user not found or token invalid'
    });
  }
      query.userId = req.user._id;
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

const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (req.user.role !== 'admin' && report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this report' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: 'Server error while fetching report' });
  }
};

const updateReport = async (req, res) => {
  try {
    const { type, injured, location, description, anonymous, status } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (req.user.role !== 'admin' && report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this report' });
    }

    if (type) report.type = type;
    if (injured !== undefined) report.injured = injured;
    if (location) report.location = location;
    if (description) report.description = description;
    if (anonymous !== undefined) report.anonymous = anonymous;

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

const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

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
  deleteReport,
  getReportOptions // 🔥 Export added here!
};

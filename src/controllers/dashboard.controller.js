const User = require('../models/User');

exports.getViewerStats = async (req, res) => {
  try {
    const employeeCount = await User.countDocuments({ role: 'Employee' });
    const managerCount = await User.countDocuments({ role: 'Manager' });

    res.json({
      employeeCount,
      managerCount,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load stats' });
  }
};

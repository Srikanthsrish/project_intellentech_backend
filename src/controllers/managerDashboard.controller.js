const User = require('../models/User');

// GET TOTAL EMPLOYEE COUNT
exports.getEmployeeCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'Employee' });
    res.json({ totalEmployees: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

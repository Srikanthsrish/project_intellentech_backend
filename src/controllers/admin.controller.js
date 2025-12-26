const User = require('../models/User');

exports.dashboardStats = async (req, res) => {
  try {
    const totalManagers = await User.countDocuments({ role: 'Manager' });
    const totalEmployees = await User.countDocuments({ role: 'Employee' });
    const activeUsers = await User.countDocuments({ status: 'Active' });
    const inactiveUsers = await User.countDocuments({ status: 'Inactive' });

    res.json({
      totalManagers,
      totalEmployees,
      activeUsers,
      inactiveUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Dashboard data error' });
  }
};

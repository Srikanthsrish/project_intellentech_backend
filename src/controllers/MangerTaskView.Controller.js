// controllers/taskController.js
const User =require( "../models/User.js");

exports.getManagerViewTasks = async (req, res) => {
  try {
    const { managerId } = req.params;

    const employees = await User.find({
      role: "Employee",
      managerId: managerId,
    }).select("name email tasks"); // only return needed data

    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

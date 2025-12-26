const User = require("../models/User");

exports.assignManager = async (req, res) => {
  try {
    const { managerId, employeeIds } = req.body;

    if (!managerId || !employeeIds?.length)
      return res.status(400).json({ msg: "Manager & Employees required" });

    const manager = await User.findById(managerId);

    if (!manager || manager.role !== "Manager")
      return res.status(400).json({ msg: "Invalid Manager" });


    // 1️⃣ Remove these employees from ANY previous manager
    await User.updateMany(
      { employees: { $in: employeeIds } },
      { $pull: { employees: { $in: employeeIds } } }
    );


    // 2️⃣ Update each employee to store new managerId
    await User.updateMany(
      { _id: { $in: employeeIds }, role: "Employee" },
      { $set: { managerId } }
    );


    // 3️⃣ Add employees to THIS manager (avoid duplicates)
    const updatedManager = await User.findByIdAndUpdate(
      managerId,
      { $addToSet: { employees: { $each: employeeIds } } },
      { new: true, runValidators: true }   // <--- VERY IMPORTANT
    );

    return res.json({
      msg: "Manager assigned successfully",
      manager: updatedManager
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

exports.getManagersWithEmployees = async (req, res) => {
  try {
    const managers = await User.find({ role: "Manager" })
      .populate("employees", "name email status");

    res.json(managers);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.unassignEmployee = async (req, res) => {
  try {
    const { managerId, employeeId } = req.body;

    await User.findByIdAndUpdate(employeeId, {
      $set: { managerId: null }
    });

    await User.findByIdAndUpdate(managerId, {
      $pull: { employees: employeeId }
    });

    res.json({ msg: "Employee unassigned successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getManagers = async (req, res) => {
  const managers = await User.find({ role: "Manager" });
  res.json(managers);
};

exports.getEmployees = async (req, res) => {
  const employees = await User.find({ role: "Employee" });
  res.json(employees);
};

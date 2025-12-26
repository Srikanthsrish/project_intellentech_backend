
const User = require("../models/User");

exports.getAllTasksForSuperAdmin = async (req, res) => {
  try {
    const { managerId } = req.query; // optional filter

    const query = { role: "Employee" };
    if (managerId) query.managerId = managerId;

    const employees = await User.find(query)
      .populate("managerId", "name email")
      .select("name email tasks managerId");

    const rows = [];

    employees.forEach(emp => {
      if (!emp.tasks || emp.tasks.length === 0) {
        rows.push({
          employeeId: emp._id,
          employeeName: emp.name || "-",
          managerName: emp.managerId ? emp.managerId.name : "Not Assigned",
          title: null,
          taskUrl: null,
          submittedUrl: null,
          deadline: null,
          submissionDate: null,
          status: null,
          taskId: null,
        });
      } else {
        emp.tasks.forEach(task => {
          rows.push({
            employeeId: emp._id,
            employeeName: emp.name || "-",
            managerName: emp.managerId ? emp.managerId.name : "Not Assigned",
            title: task.title || null,
            taskUrl: task.taskUrl || null,
            submittedUrl: task.submittedUrl || null,
            deadline: task.deadline || null,
            submissionDate: task.submissionDate || null,
            status: task.status || null,
            taskId: task._id || null,
          });
        });
      }
    });

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

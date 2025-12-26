const User = require("../models/User");

exports.getEmployeeTaskSummary = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const user = await User.findById(employeeId).select("tasks name email");

    if (!user) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const tasks = user.tasks || [];

    const summary = {
      assigned: tasks.length,
      pending: tasks.filter(t => t.status === "Pending").length,
      submitted: tasks.filter(t => t.status === "Submitted").length,
      
    };

    res.json({
      employee: {
        name: user.name,
        email: user.email
      },
      summary,
      tasks
    });

  } catch (err) {
    console.error("Task Summary Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


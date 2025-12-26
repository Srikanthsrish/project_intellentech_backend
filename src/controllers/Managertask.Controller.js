const User = require("../models/User");

const cloudinary = require("../config/cloudinary");
// GET Employees for a Manager
exports.getEmployees = async (req, res) => {
  try {
    const { managerId } = req.query;

    if (!managerId) return res.status(400).json({ message: "ManagerId required" });

    const employees = await User.find({
      role: "Employee",
      managerId: managerId // 🔹 convert string to ObjectId
    }).select("_id name email userStatus tasks");

    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching employees" });
  }
};

// CREATE Task for an Employee
exports.createTask = async (req, res) => {
  try {
    const { employeeId, title, deadline } = req.body;

    // find employee
    const employee = await User.findOne({
      _id: employeeId,
      role: "Employee"
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // if no file uploaded
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    // upload to cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "raw" }, // auto = image, video, pdf, audio
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    // create task object with cloudinary url
    const task = {
      title,
      taskUrl: uploadResult.secure_url,
      deadline,
      status: "Pending",
    };

    // push to tasks array
    employee.tasks.push(task);

    // save user
    await employee.save();

    res.json({
      message: "Task created successfully",
      task
    });

  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).json({ message: "Error creating task" });
  }
};


// DELETE Task
exports.deleteTask = async (req, res) => {
  try {
    const { employeeId, taskId } = req.params;
    const employee = await User.findOne({ _id: employeeId, role: "Employee" });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    employee.tasks = employee.tasks.filter(t => t._id.toString() !== taskId);
    await employee.save();

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting task" });
  }
};

// UPDATE Task Status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { employeeId, taskId } = req.params;
    const { taskStatus } = req.body;

    const employee = await User.findOne({ _id: employeeId, role: "Employee" });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const task = employee.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.taskStatus = taskStatus;
    await employee.save();

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating task" });
  }
};

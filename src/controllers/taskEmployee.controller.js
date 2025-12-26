const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
// 👉 Get tasks for an employee
// controllers/taskEmployee.controller.js
exports.getEmployeeTasks = async (req, res) => {
  try {
    const user = await User.findById(req.params.employeeId).populate("managerId", "name");

    if (!user || user.role !== "Employee")
      return res.status(404).json({ message: "Employee not found" });

    // Include manager name in each task
    const tasksWithManager = user.tasks.map((task) => ({
      ...task.toObject(),
      managerName: user.managerId ? user.managerId.name : "No Manager",
    }));

    res.json(tasksWithManager);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};







// EMPLOYEE → Submit Task
exports.submitTask = async (req, res) => {
  

  try {
    const { employeeId, taskId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // upload to cloudinary from BUFFER
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "workflowx/submittedTasks",
          resource_type: "raw"
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // find employee + task
    const user = await User.findOne({
      _id: employeeId,
      "tasks._id": taskId
    });

    if (!user) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = user.tasks.id(taskId);

    // update task fields
    task.submittedUrl = uploadResult.secure_url;
    task.status = "Submitted";
    task.submissionDate = new Date();

    await user.save();

    res.json({
      message: "Task submitted successfully",
      submittedUrl: uploadResult.secure_url
    });

  } catch (err) {
    console.error("Submit Task Error:", err);
    res.status(500).json({ message: "Error submitting task" });
  }
};



// 👉 Delete submited url from task 
exports.resetSubmittedTask = async (req, res) => {
  try {
    const { employeeId, taskId } = req.params;

    const user = await User.findById(employeeId);
    if (!user) return res.status(404).json({ message: "Employee not found" });

    const task = user.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.submittedUrl = "";
    task.status = "Pending";
    task.submissionDate = null; 

    await user.save();

    res.json({ message: "Submission cleared & status reset to Pending" });
  } catch (err) {
    console.error("RESET ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// controllers/employeeTask.controller.js
const Task = require('../models/Task');

// Get pending tasks for logged-in employee
exports.getMyTasks = async (req, res) => {
  const tasks = await Task.find({
    employee: req.user.id,
  }).populate('manager', 'name email');

  res.json(tasks);
};

// Submit task (link + description)
exports.submitTask = async (req, res) => {
  const { submittedLink, description } = req.body;

  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  task.submittedLink = submittedLink;
  task.description = description;
  task.status = 'Completed';

  await task.save();

  res.json({ message: 'Task submitted successfully' });
};

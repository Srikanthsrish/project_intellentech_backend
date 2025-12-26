// controllers/task.controller.js
const Task = require('../models/Task');
const User = require('../models/User');

// 1. Get employees
exports.getEmployees = async (req, res) => {
  const employees = await User.find({ role: 'Employee' })
    .select('name email');
  res.json(employees);
};

// 2. Assign task (LINK ONLY)
exports.assignTask = async (req, res) => {
  const { employeeId, managerTaskLink } = req.body;

  const task = await Task.create({
    manager: req.user.id,
    employee: employeeId,
    managerTaskLink,
  });

  res.status(201).json(task);
};

// 3. View manager tasks
exports.getManagerTasks = async (req, res) => {
  const tasks = await Task.find({ manager: req.user.id })
    .populate('employee', 'name email');
  res.json(tasks);
};

// 4. Employee submits task
exports.submitTask = async (req, res) => {
  const { taskLink, description } = req.body;

  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  task.employeeTaskLink = taskLink;
  task.description = description;
  task.status = 'Completed';

  await task.save();
  res.json({ message: 'Task submitted' });
};


// GET ALL TASKS (SuperAdmin)
exports.getAllTasks = async (req, res) => {
  const tasks = await Task.find()
    .populate('manager', 'name email')
    .populate('employee', 'name email')
    .sort({ createdAt: -1 });

  res.json(tasks);
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted successfully' });
};
exports.getEmployeeTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ employee: req.params.id });
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch employee tasks' });
  }
};


// GET employee tasks
exports.getEmployeeTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ employee: req.params.id })
      .populate('manager', 'name');

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

// SUBMIT task
exports.submitEmployeeTask = async (req, res) => {
  try {
    const { employeeTaskLink } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      {
        employeeTaskLink,
        status: 'Completed',
      },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Task submission failed' });
  }
};

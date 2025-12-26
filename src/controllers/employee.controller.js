const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

// GET ALL EMPLOYEES
exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'Employee' }).select('-password');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET EMPLOYEE BY ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select('-password');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD EMPLOYEE
exports.addEmployee = async (req, res) => {
  try {
    const { name, email, password, status } = req.body;


    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // ❌ NO hashing here (model will handle it)
    const employee = await User.create({
      name,
      email,
      password, // plain password → model hashes it
      role: 'Employee',
      status: status || 'Active',
    });

    // ✅ respond first
    res.status(201).json(employee);

    // ✅ async email
    sendEmail({
      to: email,
      subject: 'Welcome to WorkflowX',
      html: `
        <p>Hi ${name},</p>
        <p>Your login password is: <b>${password}</b></p>
      `,
    }).catch(err => {
      console.error('Email failed:', err.message);
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





// UPDATE EMPLOYEE
exports.updateEmployee = async (req, res) => {
  try {
    const { name, email, status, password } = req.body;
    const employee = await User.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    if (name) employee.name = name;
    if (email) employee.email = email;
    if (status) employee.status = status;
    if (password) {
      employee.password = password; // pre-save hook will hash it automatically
    }

    await employee.save(); // save changes
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// DELETE EMPLOYEE
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

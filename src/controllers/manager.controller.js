const User = require('../models/User');
const sendMail = require('../utils/sendEmail');
exports.addManager = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'Manager already exists' });
    }

    const manager = new User({
      name,
      email,
      password,
      role: 'Manager',
      provider: 'local',
      status: 'Active',
    });

    await manager.save();

    await sendMail({
      to: email,
      subject: 'Manager Account Created',
      html: `
        <p>Hello <b>${name}</b>,</p>
        <p>Your manager account has been created.</p>
        <p>Please login using your credentials.</p>
      `,
    });

    res.status(201).json(manager);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add manager' });
  }
};


// ===============================
// GET ALL MANAGERS
// ===============================
exports.getManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: 'Manager' }).select('-password');
    res.json(managers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch managers' });
  }
};

// ===============================
// GET MANAGER BY ID
// ===============================
exports.getManagerById = async (req, res) => {
  try {
    const manager = await User.findById(req.params.id).select('-password');
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }
    res.json(manager);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching manager' });
  }
};

// ===============================
// UPDATE MANAGER (EDIT PROFILE)
// ===============================
exports.updateManager = async (req, res) => {
  try {
    const { name, email, status, password } = req.body;

    const manager = await User.findById(req.params.id);
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    let passwordChanged = false;

    if (name) manager.name = name;
    if (email) manager.email = email;
    if (status) manager.status = status;

    if (password) {
      manager.password = password; // 🔐 hashed by schema pre-save
      passwordChanged = true;
    }

    await manager.save();

    // 📧 Send mail only if password changed
    if (passwordChanged) {
      await sendMail({
        to: manager.email,
        subject: 'Password Updated',
        html: `
          <p>Hello <b>${manager.name}</b>,</p>
          <p>Your account password was updated by SuperAdmin.</p>
          <p>If this wasn’t you, please contact support immediately.</p>
        `,
      });
    }

    res.json({ message: 'Manager updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update manager' });
  }
};

// ===============================
// DELETE MANAGER
// ===============================
exports.deleteManager = async (req, res) => {
  try {
    const manager = await User.findById(req.params.id);
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    await manager.deleteOne();
    res.json({ message: 'Manager deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete manager' });
  }
};

// ===============================
// SEND MESSAGE TO MANAGER (EMAIL)
// ===============================
exports.sendMessageToManager = async (req, res) => {
  try {
    const { message } = req.body;

    const manager = await User.findById(req.params.id);
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    await sendMail({
      to: manager.email,
      subject: 'Message from SuperAdmin',
      html: `
        <p>Hello <b>${manager.name}</b>,</p>
        <p>${message}</p>
      `,
    });

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email' });
  }
};

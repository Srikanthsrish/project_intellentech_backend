const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const { generateAccessToken, generateRefreshToken } = require('../config/jwt');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);





/* =====================
   MANUAL REGISTER
===================== */

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = new User({
      name,
      email,
      password,
      role,
      provider: "local",
    });

    await user.save();

    const maskedPassword =
      password.slice(0, 2) + "*****" + password.slice(-1);

    sendEmail({
      to: email,
      subject: "Welcome to WorkFlowX 🎉",
      html: `
        <h2>Hello ${name},</h2>

        <p>Your WorkFlowX account has been created successfully.</p>

        <h3>Account Details</h3>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Role:</strong> ${role}</li>
          <li><strong>Password:</strong> ${maskedPassword}</li>
        </ul>

        <p>You can now login and start using the system 🚀</p>
      `,
    }).catch(() => {});

    return res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }

    return res.status(500).json({ message: error.message });
  }
};







/* =====================
   MANUAL LOGIN
===================== */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    if (user.provider === 'google') {
      return res.status(400).json({ message: 'Please login using Google' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const payload = { id: user._id, role: user.role };

    res.json({
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/* =====================
   GOOGLE AUTH

*/



const googleAuth = async (req, res) => {
  try {
    const { token } = req.body; // received from frontend

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { sub, email, name } = ticket.getPayload();

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        role: 'Employee',
        provider: 'google',
        googleId: sub,
        status: 'Active',
      });
    }

    // Create JWT
    const payload = { id: user._id, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ user, accessToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Google authentication failed' });
  }
};











module.exports = {
  googleAuth,login,register
};

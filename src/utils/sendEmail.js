const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Optional: verify transporter on startup
transporter.verify((error, success) => {});

module.exports = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"WorkflowX" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};

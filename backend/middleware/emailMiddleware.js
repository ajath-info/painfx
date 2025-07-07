import sendMail from '../utils/mailer.js';

export const sendOTPEmail = async (email, otp) => {
  const html = `
    <h2>Password Reset Request</h2>
    <p>Your OTP is: <b>${otp}</b></p>
    <p>This OTP is valid for 10 minutes.</p>
  `;

  return await sendMail({
    to: email,
    subject: "Reset Password OTP",
    html,
  });
};

export const sendWelcomeEmail = async (email, name = '') => {
  const html = `
    <h2>Welcome to Our Platform</h2>
    <p>Hi ${name},</p>
    <p>We're excited to have you on board. If you need any help, feel free to reach out.</p>
  `;

  return await sendMail({
    to: email,
    subject: "Welcome to Our App!",
    html,
  });
};

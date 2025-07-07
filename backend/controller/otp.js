import {db} from '../config/db.js';
import { sendOTPEmail } from '../middleware/emailMiddleware.js';
import {generateOTP, emailCheck} from '../utils/helper.js';
import moment from 'moment';

export const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ status: 0, message: 'Email is required' });
  }

  const emailExists = await emailCheck(email);
  if (!emailExists) {
    return res.status(404).json({ status: 0, message: 'Email not found' });
  }

  const otp = generateOTP();
  const expiresAt = moment().add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss');

  try {
    // Update or insert OTP as per your optimized logic
    const [updateResult] = await db.query(
      `UPDATE otp SET otp_code = ?, expires_at = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?`,
      [otp, expiresAt, email.toLowerCase()]
    );

    if (updateResult.affectedRows === 0) {
      await db.query(
        `INSERT INTO otp (email, otp_code, expires_at) VALUES (?, ?, ?)`,
        [email.toLowerCase(), otp, expiresAt]
      );
    }

    const sent = await sendOTPEmail(email, otp);

    if (!sent) {
      return res.status(500).json({ status: 0, message: 'Failed to send OTP' });
    }

    res.json({ status: 1, message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ status: 0, message: 'Internal server error' });
  }
};

export const verifyOTP = async (req, res) => {
  let { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ status: 0, message: 'Email and OTP are required' });
  }

  email = email.toLowerCase(); // normalize

  try {
    const [rows] = await db.query(
      `SELECT * FROM otp WHERE email = ? AND otp_code = ? ORDER BY created_at DESC LIMIT 1`,
      [email, otp]
    );

    const record = rows[0];
    if (!record) {
      return res.status(400).json({ status: 0, message: 'Invalid OTP' });
    }

    const now = moment();
    const expiry = moment(record.expires_at);

    if (now.isAfter(expiry)) {
      return res.status(400).json({ status: 0, message: 'OTP expired' });
    }

    // Delete OTP after successful verification
    await db.query(`DELETE FROM otp WHERE id = ?`, [record.id]);

    res.json({ status: 1, message: 'OTP verified successfully' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ status: 0, message: 'Internal server error' });
  }
};

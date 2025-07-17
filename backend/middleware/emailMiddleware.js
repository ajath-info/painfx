import sendMail from "../utils/mailer.js";

// Enhanced base email template with better accessibility and modern design
const getBaseTemplate = (content, darkMode = false) => {
  const theme = darkMode
    ? {
        bg: "#1a1a1a",
        cardBg: "#2d2d2d",
        textPrimary: "#ffffff",
        textSecondary: "#cccccc",
        border: "#404040",
      }
    : {
        bg: "#f8fafc",
        cardBg: "#ffffff",
        textPrimary: "#1a202c",
        textSecondary: "#4a5568",
        border: "#e2e8f0",
      };

  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>PainFX</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        /* Reset and base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            max-width: 100%;
        }
        
        /* Main body styles */
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: ${theme.textPrimary};
            background-color: ${theme.bg};
            margin: 0;
            padding: 0;
            width: 100% !important;
            min-width: 100%;
        }
        
        /* Container styles */
        .email-wrapper {
            width: 100%;
            background-color: ${theme.bg};
            padding: 20px 0;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: ${theme.cardBg};
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
            border: 1px solid ${theme.border};
        }
        
        /* Header styles */
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
            opacity: 0.3;
        }
        
        .logo {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 8px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            position: relative;
            z-index: 1;
        }
        
        .tagline {
            font-size: 14px;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: 500;
            position: relative;
            z-index: 1;
        }
        
        /* Content styles */
        .content {
            padding: 40px 30px;
            color: ${theme.textPrimary};
        }
        
        .content h1 {
            color: ${theme.textPrimary};
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 20px;
            text-align: center;
            line-height: 1.3;
        }
        
        .content h2 {
            color: ${theme.textPrimary};
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 15px;
            line-height: 1.4;
        }
        
        .content h3 {
            color: ${theme.textPrimary};
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
            line-height: 1.4;
        }
        
        .content p {
            color: ${theme.textSecondary};
            margin-bottom: 16px;
            font-size: 16px;
            line-height: 1.6;
        }
        
        /* Enhanced OTP box */
        .otp-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            margin: 30px 0;
            box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
            position: relative;
            overflow: hidden;
        }
        
        .otp-box::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: pulse 3s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 0.8; }
        }
        
        .otp-label {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 15px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }
        
        .otp-code {
            font-size: 42px;
            font-weight: 800;
            letter-spacing: 12px;
            margin: 15px 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            font-family: 'Courier New', monospace;
            position: relative;
            z-index: 1;
        }
        
        .otp-validity {
            font-size: 14px;
            opacity: 0.8;
            margin-top: 15px;
            font-weight: 500;
            position: relative;
            z-index: 1;
        }
        
        /* Enhanced cards and layouts */
        .card {
            background: ${theme.cardBg};
            border: 1px solid ${theme.border};
            border-radius: 12px;
            padding: 24px;
            margin: 20px 0;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.1);
        }
        
        .card-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
        }
        
        .card-success {
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            color: white;
            border: none;
        }
        
        .card-warning {
            background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
            color: white;
            border: none;
        }
        
        .card-info {
            background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
            color: white;
            border: none;
        }
        
        /* Grid system */
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .grid-2 {
            grid-template-columns: repeat(2, 1fr);
        }
        
        .grid-3 {
            grid-template-columns: repeat(3, 1fr);
        }
        
        /* Enhanced buttons */
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            margin: 10px 5px;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s ease;
        }
        
        .button:hover::before {
            left: 100%;
        }
        
        .button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
        }
        
        .button-secondary {
            background: linear-gradient(135deg, #718096 0%, #4a5568 100%);
            box-shadow: 0 10px 30px rgba(113, 128, 150, 0.4);
        }
        
        .button-success {
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            box-shadow: 0 10px 30px rgba(72, 187, 120, 0.4);
        }
        
        .button-small {
            padding: 12px 24px;
            font-size: 14px;
        }
        
        /* Enhanced alert boxes */
        .alert {
            padding: 20px;
            border-radius: 12px;
            margin: 25px 0;
            border-left: 4px solid;
            position: relative;
            overflow: hidden;
        }
        
        .alert::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
            animation: shimmer 3s infinite;
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        .alert-warning {
            background: #fff3cd;
            border-left-color: #f6ad55;
            color: #744210;
        }
        
        .alert-success {
            background: #f0fff4;
            border-left-color: #48bb78;
            color: #22543d;
        }
        
        .alert-info {
            background: #ebf8ff;
            border-left-color: #4299e1;
            color: #2c5282;
        }
        
        .alert-error {
            background: #fed7d7;
            border-left-color: #f56565;
            color: #742a2a;
        }
        
        .alert-icon {
            font-size: 18px;
            margin-right: 10px;
            vertical-align: middle;
        }
        
        /* Enhanced footer */
        .footer {
            background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }
        
        .footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        }
        
        .footer p {
            margin-bottom: 12px;
            opacity: 0.9;
            color: white;
        }
        
        .footer-brand {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 8px;
            color: white;
        }
        
        .footer-tagline {
            font-size: 14px;
            opacity: 0.7;
            margin-bottom: 20px;
            color: white;
        }
        
        .social-links {
            margin: 25px 0;
        }
        
        .social-links a {
            color: #667eea;
            text-decoration: none;
            margin: 0 15px;
            font-size: 16px;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        
        .social-links a:hover {
            color: white;
        }
        
        .footer-legal {
            font-size: 12px;
            margin-top: 25px;
            opacity: 0.6;
            line-height: 1.5;
            color: white;
        }
        
        /* Accessibility improvements */
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
        
        /* RTL Support */
        [dir="rtl"] .otp-code {
            letter-spacing: -12px;
        }
        
        [dir="rtl"] .tagline {
            letter-spacing: -1.5px;
        }
        
        /* Dark mode specific adjustments */
        ${
          darkMode
            ? `
        .card {
            background: ${theme.cardBg};
            border-color: ${theme.border};
        }
        
        .alert-warning {
            background: #2d2a1f;
            color: #fbd38d;
        }
        
        .alert-success {
            background: #1a2e1a;
            color: #9ae6b4;
        }
        
        .alert-info {
            background: #1a242e;
            color: #90cdf4;
        }
        
        .alert-error {
            background: #2d1a1a;
            color: #feb2b2;
        }
        `
            : ""
        }
        
        /* Responsive design */
        @media (max-width: 600px) {
            .email-wrapper {
                padding: 10px;
            }
            
            .email-container {
                margin: 0;
                border-radius: 12px;
            }
            
            .header, .content, .footer {
                padding: 25px 20px;
            }
            
            .content h1 {
                font-size: 24px;
            }
            
            .otp-code {
                font-size: 32px;
                letter-spacing: 8px;
            }
            
            .grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .grid-2, .grid-3 {
                grid-template-columns: 1fr;
            }
            
            .button {
                display: block;
                width: 100%;
                margin: 10px 0;
            }
            
            .social-links a {
                display: block;
                margin: 10px 0;
            }
        }
        
        /* Print styles */
        @media print {
            .email-wrapper {
                background: white;
                padding: 0;
            }
            
            .email-container {
                box-shadow: none;
                border: 1px solid #ccc;
            }
            
            .button {
                background: #667eea !important;
                color: white !important;
            }
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
            .content {
                background: white;
                color: black;
            }
            
            .button {
                background: #000080 !important;
                color: white !important;
                border: 2px solid #000080 !important;
            }
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="header">
                <div class="logo" role="banner">PainFX</div>
                <div class="tagline">Your Health, Our Priority</div>
            </div>
            
            ${content}
            
            <div class="footer" role="contentinfo">
                <div class="footer-brand">PainFX Healthcare Solutions</div>
                <div class="footer-tagline">Making healthcare accessible and convenient for everyone</div>
                <div class="social-links">
                    <a href="mailto:info@painfx.com" aria-label="Email support">📧 info@painfx.com</a>
                    <a href="tel:+13153695943" aria-label="Call support">📱 +1 315 369 5943</a>
                </div>
                <div class="footer-legal">
                    © 2025 PainFX. All rights reserved.<br>
                    This email was sent to you because you have an account with PainFX.<br>
                    <a href="" style="color: #667eea;">Privacy Policy</a> | 
                    <a href="" style="color: #667eea;">Terms of Service</a> | 
                    <a href="" style="color: #667eea;">Unsubscribe</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;
};

// Enhanced OTP Email with better security and UX
export const sendOTPEmail = async (
  email,
  otp,
  purpose = "password reset",
  expiryMinutes = 10
) => {
  const content = `
        <div class="content">
            <h1>🔐 Verification Required</h1>
            <p>Hello,</p>
            <p>We received a request for <strong>${purpose}</strong> on your PainFX account. Please use the following One-Time Password (OTP) to proceed:</p>
            
            <div class="otp-box" role="region" aria-label="OTP Code">
                <div class="otp-label">Your OTP Code</div>
                <div class="otp-code" role="text" aria-label="OTP: ${String(otp)
                  .split("")
                  .join(", ")}">${otp}</div>
                <div class="otp-validity">⏰ Valid for ${expiryMinutes} minutes only</div>
            </div>
            
            <div class="alert alert-warning" role="alert">
                <span class="alert-icon" aria-hidden="true">⚠️</span>
                <strong>Security Notice:</strong> Never share this OTP with anyone. PainFX will never ask for your OTP over phone or email.
            </div>
            
            <div class="alert alert-info" role="alert">
                <span class="alert-icon" aria-hidden="true">💡</span>
                <strong>Having trouble?</strong> Make sure to enter the OTP exactly as shown above. If it doesn't work, you can request a new one.
            </div>
            
            <p>If you didn't request this ${purpose}, please ignore this email or contact our support team immediately for assistance.</p>
            
            <p>Best regards,<br>
            <strong>The PainFX Security Team</strong></p>
        </div>
    `;

  return await sendMail({
    to: email,
    subject: `🔐 Your PainFX Verification Code - ${otp}`,
    html: getBaseTemplate(content),
  });
};

// Login Notification Email Template
export const sendLoginNotificationEmail = async (
  email,
  name = "",
  loginDetails = {}
) => {
  const {
    device = "Unknown Device",
    location = "Unknown Location",
    time = new Date().toLocaleString(),
    ipAddress = "Hidden for security",
  } = loginDetails;

  const content = `
        <div class="content">
            <h1>👋 Welcome Back!</h1>
            <p>Hello ${name},</p>
            <p>We noticed a successful login to your PainFX account. Here are the details:</p>
            
            <div class="feature-card" style="text-align: left; margin: 20px 0;">
                <h3 style="color: #667eea; margin-bottom: 15px;">📱 Login Details</h3>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Device:</strong> ${device}</p>
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>IP Address:</strong> ${ipAddress}</p>
            </div>
            
            <div class="warning">
                <span class="warning-icon">🛡️</span>
                <strong>Security Check:</strong> If this wasn't you, please change your password immediately and contact our support team.
            </div>            
            <p>Thank you for choosing PainFX for your healthcare needs.</p>
            
            <p>Stay healthy,<br>
            <strong>The PainFX Security Team</strong></p>
        </div>
    `;

  return await sendMail({
    to: email,
    subject: `🔐 Login Alert - PainFX Account Access`,
    html: getBaseTemplate(content),
  });
};

// Welcome Email Template
export const sendWelcomeEmail = async (email, name = "", role = "patient") => {
  const isDoctor = role === "doctor";

  const introText = isDoctor
    ? "We're excited to welcome you as a healthcare provider on PainFX. Let's make a difference together!"
    : "We're absolutely thrilled to have you join the PainFX family! You've just taken the first step towards revolutionizing your healthcare experience.";

  const nextSteps = isDoctor
    ? `
      <p>1. <strong>Complete your professional profile</strong> – Add your specialties, certifications, and availability</p>
      <p>2. <strong>Set up your clinic preferences</strong> – Define consultation types, timings, and services</p>
      <p>3. <strong>Start accepting appointments</strong> – Manage bookings and help patients effortlessly</p>
    `
    : `
      <p>1. <strong>Complete your profile</strong> – Add your medical history and preferences</p>
      <p>2. <strong>Find your doctor</strong> – Browse our network of healthcare professionals</p>
      <p>3. <strong>Book your first appointment</strong> – Experience seamless healthcare</p>
    `;

  const content = `
    <div class="content">
      <div class="welcome-card">
        <div class="welcome-icon">🎉</div>
        <h1 style="color: white; margin-bottom: 10px;">Welcome to PainFX!</h1>
        <p style="color: white; opacity: 0.9;">
          ${isDoctor ? "Start your practice with confidence" : "Your journey to better health starts here"}
        </p>
      </div>
      
      <h2>Hello ${name || "there"}! 👋</h2>
      <p>${introText}</p>

      <div class="features">
        ${isDoctor ? `
          <div class="feature-card">
            <div class="feature-icon">📅</div>
            <h3>Appointment Management</h3>
            <p>Manage bookings, cancellations, and availability with ease.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📁</div>
            <h3>Digital Records</h3>
            <p>Maintain secure, accessible medical documentation for your patients.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🩺</div>
            <h3>Professional Growth</h3>
            <p>Reach more patients and grow your practice with PainFX.</p>
          </div>
        ` : `
          <div class="feature-card">
            <div class="feature-icon">👩‍⚕️</div>
            <h3>Expert Doctors</h3>
            <p>Connect with certified healthcare professionals anytime, anywhere.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📅</div>
            <h3>Easy Appointments</h3>
            <p>Book, reschedule, or cancel appointments with just a few clicks.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🏥</div>
            <h3>Comprehensive Care</h3>
            <p>From consultations to follow-ups, we've got your health covered.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💊</div>
            <h3>Prescription Management</h3>
            <p>Get digital prescriptions and track your medication easily.</p>
          </div>
        `}
      </div>

      <h3>🎯 What's Next?</h3>
      ${nextSteps}

      <div class="warning" style="background: #e8f5e8; border-color: #27ae60; border-left-color: #27ae60;">
        <span class="warning-icon" style="color: #27ae60;">💡</span>
        <strong>Pro Tip:</strong> Enable notifications to stay updated about your ${isDoctor ? "appointments and patient messages" : "appointments and health reminders"}!
      </div>

      <p>If you have any questions or need assistance, our support team is here to help 24/7. Just reply to this email or contact us through the app.</p>

      <p>${isDoctor ? "We're excited to support your medical journey!" : "Here's to your health and wellness journey!"}</p>

      <p>Warm regards,<br>
      <strong>The PainFX Team</strong> 💙</p>
    </div>
  `;

  return await sendMail({
    to: email,
    subject: `🎉 Welcome to PainFX - ${isDoctor ? "Start Your Practice" : "Your Health Journey Starts Now"}!`,
    html: getBaseTemplate(content),
  });
};

// Password Reset Success Email Template
export const sendPasswordResetSuccessEmail = async (email, name = "") => {
  const content = `
        <div class="content">
            <h1>✅ Password Reset Successful</h1>
            <p>Hello ${name},</p>
            <p>Your password has been successfully reset for your PainFX account. You can now login with your new password.</p>
            
            <div class="feature-card" style="background: #e8f5e8; border-left-color: #27ae60;">
                <div class="feature-icon" style="color: #27ae60;">🛡️</div>
                <h3>Security Tips</h3>
                <p>• Use a strong, unique password</p>
                <p>• Enable two-factor authentication</p>
                <p>• Never share your login credentials</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="#" class="button">🔐 Login to Your Account</a>
            </div>
            
            <p>If you didn't reset your password, please contact our support team immediately.</p>
            
            <p>Stay secure,<br>
            <strong>The PainFX Security Team</strong></p>
        </div>
    `;

  return await sendMail({
    to: email,
    subject: `✅ Password Reset Successful - PainFX`,
    html: getBaseTemplate(content),
  });
};

// Appointment Booking Confirmation Email Template
export const sendAppointmentBookingEmail = async (email, appointmentData) => {
  const {
    patientName,
    doctorName,
    appointmentDate,
    appointmentTime,
    appointmentType,
    department,
    location,
    appointmentId,
    doctorSpecialization,
    consultationFee,
    appointmentDuration = "30 minutes",
    instructions = "",
  } = appointmentData;

  const content = `
        <div class="content">
            <h1>✅ Appointment Confirmed</h1>
            <p>Hello ${patientName},</p>
            <p>Great news! Your appointment has been successfully booked with PainFX. Here are your appointment details:</p>
            
            <div class="feature-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; text-align: left;">
                <h3 style="color: white; margin-bottom: 20px;">📅 Appointment Details</h3>
                <p><strong>Appointment ID:</strong> ${appointmentId}</p>
                <p><strong>Date:</strong> ${appointmentDate}</p>
                <p><strong>Time:</strong> ${appointmentTime}</p>
                <p><strong>Duration:</strong> ${appointmentDuration}</p>
                <p><strong>Type:</strong> ${appointmentType}</p>
            </div>
            
            <div class="features">
                <div class="feature-card">
                    <div class="feature-icon">👨‍⚕️</div>
                    <h3>Doctor Information</h3>
                    <p><strong>Dr. ${doctorName}</strong></p>
                    <p>${doctorSpecialization}</p>
                    <p>${department}</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">📍</div>
                    <h3>Location</h3>
                    <p>${location}</p>
                    <p><strong>Fee:</strong> $${consultationFee}</p>
                </div>
            </div>
            
            ${
              instructions
                ? `
            <div class="warning" style="background: #e8f5e8; border-color: #27ae60; border-left-color: #27ae60;">
                <span class="warning-icon" style="color: #27ae60;">📝</span>
                <strong>Special Instructions:</strong> ${instructions}
            </div>
            `
                : ""
            }
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="#" class="button">📱 View in App</a>
                <a href="#" class="button" style="margin-left: 10px;">📅 Add to Calendar</a>
            </div>
            
            <div class="warning">
                <span class="warning-icon">⚠️</span>
                <strong>Important:</strong> Please arrive 15 minutes early for your appointment. Bring a valid ID and any relevant medical documents.
            </div>
            
            <p>Need to make changes? You can reschedule or cancel your appointment up to 2 hours before the scheduled time.</p>
            
            <p>We look forward to seeing you!</p>
            
            <p>Best regards,<br>
            <strong>The PainFX Team</strong></p>
        </div>
    `;

  return await sendMail({
    to: email,
    subject: `✅ Appointment Confirmed - ${appointmentDate} at ${appointmentTime}`,
    html: getBaseTemplate(content),
  });
};

// Appointment Cancellation Email Template
export const sendAppointmentCancellationEmail = async (
  email,
  appointmentData
) => {
  const {
    patientName,
    doctorName,
    appointmentDate,
    appointmentTime,
    appointmentId,
    cancellationReason = "",
    refundAmount = 0,
    refundTimeline = "3-5 business days",
  } = appointmentData;

  const content = `
        <div class="content">
            <h1>❌ Appointment Cancelled</h1>
            <p>Hello ${patientName},</p>
            <p>Your appointment has been cancelled as requested. Here are the details:</p>
            
            <div class="feature-card" style="background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%); color: white; text-align: left;">
                <h3 style="color: white; margin-bottom: 20px;">📅 Cancelled Appointment</h3>
                <p><strong>Appointment ID:</strong> ${appointmentId}</p>
                <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
                <p><strong>Date:</strong> ${appointmentDate}</p>
                <p><strong>Time:</strong> ${appointmentTime}</p>
                ${
                  cancellationReason
                    ? `<p><strong>Reason:</strong> ${cancellationReason}</p>`
                    : ""
                }
            </div>
            
            ${
              refundAmount > 0
                ? `
            <div class="feature-card" style="background: #e8f5e8; border-left-color: #27ae60;">
                <div class="feature-icon" style="color: #27ae60;">💰</div>
                <h3>Refund Information</h3>
                <p><strong>Refund Amount:</strong> ₹${refundAmount}</p>
                <p><strong>Timeline:</strong> ${refundTimeline}</p>
                <p>The refund will be processed to your original payment method.</p>
            </div>
            `
                : ""
            }
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="#" class="button">🔍 Find New Doctor</a>
                <a href="#" class="button" style="margin-left: 10px;">📅 Book New Appointment</a>
            </div>
            
            <p>We're sorry to see your appointment cancelled. If you need to reschedule, we're here to help you find another suitable time slot.</p>
            
            <p>Take care,<br>
            <strong>The PainFX Team</strong></p>
        </div>
    `;

  return await sendMail({
    to: email,
    subject: `❌ Appointment Cancelled - ${appointmentId}`,
    html: getBaseTemplate(content),
  });
};

// Appointment Rescheduling Email Template
export const sendAppointmentRescheduleEmail = async (
  email,
  appointmentData
) => {
  const {
    patientName,
    doctorName,
    oldDate,
    oldTime,
    newDate,
    newTime,
    appointmentId,
    appointmentType,
    location,
    rescheduleReason = "",
  } = appointmentData;

  const content = `
        <div class="content">
            <h1>🔄 Appointment Rescheduled</h1>
            <p>Hello ${patientName},</p>
            <p>Your appointment has been successfully rescheduled. Here are your updated details:</p>
            
            <div class="features">
                <div class="feature-card" style="background: #fff3cd; border-left-color: #f39c12;">
                    <div class="feature-icon" style="color: #f39c12;">📅</div>
                    <h3>Previous Appointment</h3>
                    <p><strong>Date:</strong> ${oldDate}</p>
                    <p><strong>Time:</strong> ${oldTime}</p>
                </div>
                
                <div class="feature-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white;">
                    <div class="feature-icon" style="color: white;">✅</div>
                    <h3 style="color: white;">New Appointment</h3>
                    <p><strong>Date:</strong> ${newDate}</p>
                    <p><strong>Time:</strong> ${newTime}</p>
                </div>
            </div>
            
            <div class="feature-card" style="text-align: left;">
                <h3 style="color: #667eea;">📋 Appointment Details</h3>
                <p><strong>Appointment ID:</strong> ${appointmentId}</p>
                <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
                <p><strong>Type:</strong> ${appointmentType}</p>
                <p><strong>Location:</strong> ${location}</p>
                ${
                  rescheduleReason
                    ? `<p><strong>Reason:</strong> ${rescheduleReason}</p>`
                    : ""
                }
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="#" class="button">📱 View in App</a>
                <a href="#" class="button" style="margin-left: 10px;">📅 Add to Calendar</a>
            </div>
            
            <div class="warning">
                <span class="warning-icon">⚠️</span>
                <strong>Remember:</strong> Please arrive 15 minutes early for your rescheduled appointment.
            </div>
            
            <p>Thank you for your flexibility. We look forward to seeing you at your new appointment time!</p>
            
            <p>Best regards,<br>
            <strong>The PainFX Team</strong></p>
        </div>
    `;

  return await sendMail({
    to: email,
    subject: `🔄 Appointment Rescheduled - ${newDate} at ${newTime}`,
    html: getBaseTemplate(content),
  });
};

// Appointment Completion Email Template
export const sendAppointmentCompletionEmail = async (
  email,
  appointmentData
) => {
  const {
    patientName,
    doctorName,
    appointmentDate,
    appointmentTime,
    appointmentId,
    prescription = "",
    followUpDate = "",
    nextAppointmentRecommended = false,
    feedback = true,
  } = appointmentData;

  const content = `
        <div class="content">
            <h1>✅ Appointment Completed</h1>
            <p>Hello ${patientName},</p>
            <p>Your appointment with Dr. ${doctorName} has been successfully completed. Thank you for choosing PainFX!</p>
            
            <div class="feature-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; text-align: left;">
                <h3 style="color: white; margin-bottom: 20px;">📅 Completed Appointment</h3>
                <p><strong>Appointment ID:</strong> ${appointmentId}</p>
                <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
                <p><strong>Date:</strong> ${appointmentDate}</p>
                <p><strong>Time:</strong> ${appointmentTime}</p>
            </div>
            
            ${
              Pork
                ? `
            <div class="feature-card" style="background: #e8f5e8; border-left-color: #27ae60;">
                <div class="feature-icon" style="color: #27ae60;">💊</div>
                <h3>Prescription</h3>
                <p style="white-space: pre-line;">${prescription}</p>
            </div>
            `
                : ""
            }
            
            ${
              followUpDate
                ? `
            <div class="warning" style="background: #e3f2fd; border-color: #2196f3; border-left-color: #2196f3;">
                <span class="warning-icon" style="color: #2196f3;">📅</span>
                <strong>Follow-up Recommended:</strong> ${followUpDate}
            </div>
            `
                : ""
            }
            
            <div class="features">
                <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <h3>Digital Prescription</h3>
                    <p>Access your prescription anytime in the app</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">💬</div>
                    <h3>Chat with Doctor</h3>
                    <p>Continue conversation for any queries</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">🔄</div>
                    <h3>Book Follow-up</h3>
                    <p>Schedule your next appointment easily</p>
                </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="#" class="button">📱 View Prescription</a>
                ${
                  nextAppointmentRecommended
                    ? '<a href="#" class="button" style="margin-left: 10px;">📅 Book Follow-up</a>'
                    : ""
                }
            </div>
            
            ${
              feedback
                ? `
            <div class="feature-card" style="background: #f8f9fa; border-left-color: #667eea;">
                <div class="feature-icon" style="color: #667eea;">⭐</div>
                <h3>Share Your Experience</h3>
                <p>Help us improve by rating your experience with Dr. ${doctorName}</p>
                <div style="text-align: center; margin-top: 15px;">
                    <a href="#" class="button" style="font-size: 14px; padding: 10px 20px;">⭐ Rate Doctor</a>
                </div>
            </div>
            `
                : ""
            }
            
            <p>We hope you had a great experience with PainFX. Take care of your health!</p>
            
            <p>Best wishes,<br>
            <strong>The PainFX Team</strong></p>
        </div>
    `;

  return await sendMail({
    to: email,
    subject: `✅ Appointment Completed - Thank You!`,
    html: getBaseTemplate(content),
  });
};
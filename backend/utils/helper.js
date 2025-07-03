
// api response helper function
// This function standardizes the API response format for all endpoints
export const apiResponse = (res, { error = false, code = 200, status = 1, message, payload = {} } = {}) => {
  const resposneBody = { error, code, status, message, payload };
  return res.status(code).json(resposneBody);
};

// Generate a random 4-digit OTP (One-Time Password)
// This function can be used for user verification, password reset, etc.
export const generateOTP = () => {
  // Generate a random 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp;
};

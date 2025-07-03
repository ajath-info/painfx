import { apiResponse } from './helper.js';

/**
 * Express API error handling middleware
 * Catches thrown errors and sends standardized responses
 */
export const apiResponseError = (err, req, res, next) => {
  return apiResponse(res, {
    error: true,
    code: 500,
    status: 0,
    message: err.message || 'Internal Server Error...',
    payload: {},
  });
};

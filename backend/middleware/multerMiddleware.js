import multer from 'multer';

// Configure multer middleware to parse multipart/form-data without file uploads
export const multerMiddleware = multer().none();
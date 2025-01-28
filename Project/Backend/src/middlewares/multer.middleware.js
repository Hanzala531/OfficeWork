import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join('public', 'temp');

// Ensure the temp directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use the ensured directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});

export const upload = multer({ storage });
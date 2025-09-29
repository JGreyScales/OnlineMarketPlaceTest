const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

const storage = multer.memoryStorage(); // Store the file in memory

const fileFilter = (req, file, cb) => {
  // Only accepts (JPG, PNG)
  const filetypes = /jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb(new Error('Only JPG, and PNG files are allowed'), false);
  }
};

const fileUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit size to 10MB
}).single('file');


// app.post('/upload-validated', fileUpload, (req, res) => {
//     res.send({ message: 'Validated file uploaded!', file: req.file });
//   });
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../../middleware/upload.middleware');
const { sendResponse, sendError } = require('../../utils/response');

// POST /api/v1/upload — single image upload
router.post('/', (req, res) => {
    upload.single('image')(req, res, (err) => {
        // Handle multer-specific errors
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return sendError(res, 400, 'File too large. Maximum size is 10MB.');
            }
            return sendError(res, 400, `Upload error: ${err.message}`);
        }

        // Handle custom file filter errors (wrong type)
        if (err) {
            return sendError(res, 400, err.message || 'Upload failed.');
        }

        // No file was attached at all
        if (!req.file) {
            return sendError(res, 400, 'No image file provided. Include a file field named "image".');
        }

        // Build the full accessible URL
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        return sendResponse(res, 200, true, 'Image uploaded successfully', {
            url: fileUrl,
            filename: req.file.filename,
            size: req.file.size,
            mimetype: req.file.mimetype
        });
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../../middleware/upload.middleware');
const { sendResponse, sendError } = require('../../utils/response');

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// POST /api/v1/upload — single image upload
router.post('/', (req, res) => {
    upload.single('image')(req, res, async (err) => {
        // Handle multer-specific errors
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return sendError(res, 400, 'File too large. Maximum size is 10MB.');
            }
            return sendError(res, 400, `Upload error: ${err.message}`);
        }

        if (err) {
            return sendError(res, 400, err.message || 'Upload failed.');
        }

        if (!req.file) {
            return sendError(res, 400, 'No image file provided. Include a file field named "image".');
        }

        try {
            const fileName = `img-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
            const uploadDir = path.join(__dirname, '../../../uploads');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, fileName);

            // Process image: Resize (max width 1200px), WebP format, 80% quality
            await sharp(req.file.buffer)
                .resize({ width: 1200, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toFile(filePath);

            const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${fileName}`;

            return sendResponse(res, 200, true, 'Image processed and uploaded successfully', {
                url: fileUrl,
                originalName: req.file.originalname,
                filename: fileName,
                mimetype: 'image/webp'
            });
        } catch (processError) {
            console.error('Image processing error:', processError);
            return sendError(res, 500, 'Failed to process image');
        }
    });
});

module.exports = router;

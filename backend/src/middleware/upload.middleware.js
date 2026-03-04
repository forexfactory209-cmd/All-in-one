const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const isValid = allowed.test(path.extname(file.originalname).toLowerCase()) &&
        allowed.test(file.mimetype.replace('image/', ''));
    if (isValid) cb(null, true);
    else cb(new Error('Only image files are allowed (jpg, png, webp, gif)'), false);
};

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter
});

module.exports = upload;

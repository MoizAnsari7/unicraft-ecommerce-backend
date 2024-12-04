const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Check uploads directory during storage setup
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    console.log(`Uploads directory not found, creating at: ${uploadDir}`);
    fs.mkdirSync(uploadDir, { recursive: true });
} else {
    console.log(`Uploads directory exists at: ${uploadDir}`);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('Destination path:', uploadDir); // Debug destination
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `${uniqueSuffix}-${file.originalname}`;
        console.log('Generated filename:', filename); // Debug filename
        cb(null, filename);
    }
});

const upload = multer({ storage });
module.exports = upload;

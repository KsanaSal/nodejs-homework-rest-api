const multer = require("multer");
const path = require("path");

const multerStorage = multer.diskStorage({
    destination: path.join(__dirname, "../", "temp"),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: multerStorage,
});

module.exports = upload;

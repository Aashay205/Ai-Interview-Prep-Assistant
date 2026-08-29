const multer = require("multer")

// Only allow PDF files
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["application/pdf"]
    
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("Only PDF files are allowed"), false)
    }
}

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024 // 3MB
    },
    fileFilter
})

module.exports = upload
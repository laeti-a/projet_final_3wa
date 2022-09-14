// Multer to upload image
const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/img/meals/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const checkFileType = (req, file, cb) => {
    if(file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/png"){
        cb(null, true)
    }
    else{
        cb(null, false)
    }
}


const upload = multer({ storage: storage, fileFilter: checkFileType })

module.exports = upload

const multer = require('multer');
const DataUri = require('datauri');
const path = require('path')

// const storage = cloudinarStorage({
//     cloudinary: cloudinary,
//     folder: 'uploads',
//     allowedFormats: ['jpg', 'jpeg', 'png'],
//     filename: function(req, file, cb) {
//         cb(undefined, file.originalname)
//     }s
// })

const storage = multer.memoryStorage();

const dUri = new DataUri();

/**
 * 
 * @param {@description} This function converts file buffer to url
 * @param {Object} req constaining the file object 
 * @param {String} The data url from the string buffer  
 */


let filter = function(req, file, cb) {
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    if(mimetype && extname) {
        return  cb(null, true);
    }
    cb(new Error("Sorry but we don't allow picture type other than jpeg, jpg or png"), false);
}


//Prevents uploads beyond 5MB
let fileSize = {
	fileSize: 1024 * 1024 * 5
}

const multerUploads = multer({ storage: storage, fileFilter: filter, limits: fileSize });

const dataUri = req => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

module.exports = {
    dataUri,
    multerUploads
}
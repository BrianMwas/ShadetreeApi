// import { config, uploader } from 'cloudinary';
const { config, uploader }= require('cloudinary').v2;
require('dotenv').config();


const cloudinaryConfig = (req, res, next) => { 
    config({
        cloud_name: process.env.CLOUD_NAME,
        api_key : process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    next();
};

module.exports = {
    uploader,
    cloudinaryConfig
}
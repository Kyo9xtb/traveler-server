const express = require('express');
const multer = require('multer');
const path = require('path');
const Router = express.Router();

const storageProduct = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './src/public/images/text_upload');
    },
    filename: (req, file, callBack) => {
        callBack(null, Date.now() + path.extname(file.originalname));
    },
});
const uploadImages = multer({
    storage: storageProduct,
});

const imageTextEditor = uploadImages.single('image_texteditor');

Router.route('/:id?')
    //[GET]
    //[POST]
    .post(imageTextEditor, (req, res, next) => {
        // console.log('Posssssss');
        // console.log(req.body);
        // console.log(req.file);
        const image_texteditor = req.file;
        res.json({
            image_url: `${process.env.HOSTNAME}/images/text_upload/${image_texteditor.filename}`,
        });
    });
//[PUT]
//[DELETE]
module.exports = Router;

const express = require('express');
const multer = require('multer');
const path = require('path');
const Router = express.Router();

const {
    handlerGetTourPlace,
    handlerCreateTourPlace,
    handlerUpdateTourPlace,
    handlerDeleteTourPlace,
} = require('../../controllers/touristPlaceController');

const storageProduct = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './src/public/images/tourist_place/');
    },
    filename: (req, file, callBack) => {
        callBack(null, Date.now() + path.extname(file.originalname));
    },
});
const uploadProduct = multer({
    storage: storageProduct,
});

const cpUpload = uploadProduct.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'detailed_image', maxCount: 15 },
]);

Router.route('/:id?')
    //[GET]
    .get(handlerGetTourPlace)
    //[POST]
    .post(cpUpload, handlerCreateTourPlace)
    //[PUT]
    .put(cpUpload, handlerUpdateTourPlace)
    //[DELETE]
    .delete(handlerDeleteTourPlace);
module.exports = Router;

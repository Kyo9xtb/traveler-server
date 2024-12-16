const express = require('express');
const multer = require('multer');
const path = require('path');
const Router = express.Router();

const {
    handlerGetTour,
    handlerCreateTour,
    handlerUpdateTour,
    handlerDeleteTour,
} = require('../../controllers/tourController');

const storageProduct = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './src/public/images/tour/');
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
    // [api/v1/tour]
    //[GET]
    .get(handlerGetTour)
    //[POST]
    .post(cpUpload, handlerCreateTour)
    //[PUT]
    .put(cpUpload, handlerUpdateTour)
    // .put(cpUpload, (req, res) => {
    //     const { thumbnail } = req.files;
    //     console.log('body ===>', req.body);
    //     console.log('Files ===>', req.files);
    //     res.json('success');
    // })
    //[DELETE]
    .delete(handlerDeleteTour);
module.exports = Router;

const express = require('express');
const multer = require('multer');
const path = require('path');
const Router = express.Router();

const {
    handlerGetNews,
    handlerCreateNews,
    handlerUpdateNews,
    handlerDeleteNews,
} = require('../controllers/newsController');
const storageProduct = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './src/public/images/news');
    },
    filename: (req, file, callBack) => {
        callBack(null, Date.now() + path.extname(file.originalname));
    },
});
const uploadNews = multer({
    storage: storageProduct,
});

const newsUpload = uploadNews.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'detailed_image', maxCount: 15 },
]);

Router.route('/:id?')
    //[GET]
    .get(handlerGetNews)
    //[POST]
    .post(newsUpload, handlerCreateNews)
    //[PUT]
    .put(newsUpload, handlerUpdateNews) 
    //[DELETE]
    .delete(handlerDeleteNews);
module.exports = Router;

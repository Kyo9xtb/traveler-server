const express = require('express');
const multer = require('multer');
const upload = multer();
const Router = express.Router();

const {
    handlerGetBookTour,
    handlerCreateBookTour,
    handlerUpdateBookTour,
    handlerDeleteBookTour,
} = require('../controllers/booktourController');

Router.route('/:id?')
    //[GET]
    .get(handlerGetBookTour)
    //[POST]
    .post(upload.none(),handlerCreateBookTour)
    //[PUT]
    .put(upload.none(),handlerUpdateBookTour)
    //[DELETE]
    .delete(handlerDeleteBookTour);
module.exports = Router;

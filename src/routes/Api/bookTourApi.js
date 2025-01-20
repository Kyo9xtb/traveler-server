const express = require('express');
const multer = require('multer');
const upload = multer();
const Router = express.Router();

const {
    handleGetBookTour,
    handleCreateBookTour,
    handleUpdateBookTour,
    handleDeleteBookTour,
} = require('../../controllers/bookTourController');

Router.route('/:id?')
    //[GET]
    .get(handleGetBookTour)
    // [POST]
    .post(upload.none(), handleCreateBookTour)
    // [PUT]
    .put(upload.none(), handleUpdateBookTour)
    //[DELETE]
    .delete(handleDeleteBookTour);
module.exports = Router;

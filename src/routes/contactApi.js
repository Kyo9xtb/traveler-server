const express = require('express');
const multer = require('multer');
const path = require('path');
const Router = express.Router();
const upload = multer();

const {
    handlerGetContact,
    handlerCreateContact,
    handlerUpdateContact,
    handlerDeleteContact,
} = require('../controllers/contactController');

Router.route('/:id?')
    //[GET]
    .get(handlerGetContact)
    //[POST]
    .post(upload.none(), handlerCreateContact)
    //[PUT]
    .put(upload.none(), handlerUpdateContact)
    //[DELETE]
    .delete(handlerDeleteContact);
module.exports = Router;

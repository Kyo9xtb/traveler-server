const express = require('express');
const multer = require('multer');
const path = require('path');
const Router = express.Router();
const upload = multer();

const {
    handleGetContact,
    handleCreateContact,
    handleUpdateContact,
    handleDeleteContact,
} = require('../../controllers/contactController');

Router.route('/:id?')
    //[GET]
    .get(handleGetContact)
    //[POST]
    .post(upload.none(), handleCreateContact)
    //[PUT]
    .put(upload.none(), handleUpdateContact)
    //[DELETE]
    .delete(handleDeleteContact);
module.exports = Router;

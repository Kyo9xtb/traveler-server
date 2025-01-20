const express = require('express');
const multer = require('multer');
const path = require('path');
const Router = express.Router();

const {
    handleLogin,
    handleLogout,
    handleCheckLogin,
    handleGetAdmin,
    handleCreateAdmin,
    handleUpdateAdmin,
    handleDeleteAdmin,
    handleCheckEmail,
} = require('../../controllers/adminController');

const storageProduct = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './src/public/images/admin_avatar/');
    },
    filename: (req, file, callBack) => {
        callBack(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storageProduct,
});

const cpUpload = upload.single('avatar');
Router.route('/login')
    //[POST]
    .post(handleLogin);

Router.route('/logout')
    //[POST]
    .post(handleLogout);

Router.route('/me')
    //[GET]
    .get(handleCheckLogin);
Router.route('/account/email')
    //[POST]
    .post(handleCheckEmail);
Router.route('/account/:id?')
    //[GET]
    .get(handleGetAdmin)
    //[POST]
    .post(cpUpload, handleCreateAdmin)
    // //[PUT]
    .put(cpUpload, handleUpdateAdmin)
    // //[DELETE]
    .delete(handleDeleteAdmin);
module.exports = Router;

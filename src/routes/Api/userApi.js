const express = require('express');
const multer = require('multer');
const path = require('path');
const Router = express.Router();

const {
    handleGetUser,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleLogin,
    handleCheckLogin,
    handleLogout,
    handleCheckEmail,
} = require('../../controllers/userController');

const storageProduct = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './src/public/images/user_avatar/');
    },
    filename: (req, file, callBack) => {
        callBack(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storageProduct,
});

// const cpUpload = upload.fields([
//     { name: 'avatar', maxCount: 1 },
// ]);
const cpUpload = upload.single('avatar');
Router.route('/email')
    //[POST]
    .post(handleCheckEmail);
Router.route('/login')
    //[POST]
    .post(handleLogin);

Router.route('/logout').post(handleLogout);

Router.route('/me')
    //[GET]
    .get(handleCheckLogin);

Router.route('/:id?')
    //[GET]
    .get(handleGetUser)
    //[POST]
    .post(cpUpload, handleCreateUser)
    //[PUT]
    // .put(cpUpload, (req, res) => {
    //     console.log('body',req.body);
    //     res.send('Success');
    // })
    .put(cpUpload, handleUpdateUser)
    //[DELETE]
    .delete(handleDeleteUser);

module.exports = Router;

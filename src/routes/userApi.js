const express = require('express');
const multer = require('multer');
const path = require('path');
const Router = express.Router();

const {
    handlerGetUser,
    handlerCreateUser,
    handlerUpdateUser,
    handlerDeleteUser,
} = require('../controllers/userController');
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
const cpUpload = upload.single('avatar')
Router.route('/:id?')
    //[GET]
    .get(handlerGetUser)
    //[POST]
    .post(cpUpload, handlerCreateUser)
    //[PUT]
    .put(cpUpload, handlerUpdateUser)
    //[DELETE]
    .delete(handlerDeleteUser);
module.exports = Router;

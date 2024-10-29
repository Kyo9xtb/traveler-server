const User = require('../models/userModel');

const handlerGetUser = async (req, res, next) => {
    try {
        if (req.params.id) {
            User.getUsersById(req.params.id, (resStatus, resMessage, resData) => {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            });
        } else {
            User.getUsers((resStatus, resMessage, resData) => {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            });
        }
    } catch (error) {
        next(error);
    }
};

const handlerCreateUser = async (req, res, next) => {
    try {
        User.createUser(req, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};

const handlerUpdateUser = async (req, res, next) => {
    try {
        User.updateUser(req, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};
const handlerDeleteUser = async (req, res, next) => {
    try {
        User.deleteUser(req.params.id, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    handlerGetUser,
    handlerCreateUser,
    handlerUpdateUser,
    handlerDeleteUser,
};

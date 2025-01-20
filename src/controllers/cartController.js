const Cart = require('../models/cartModel');

const handleGetCart = (req, res, next) => {
    try {
        if (!isNaN(Number(req.params.id))) {
            Cart.getCartById(req.params.id, (resStatus, resMessage, resData) => {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            });
        } else {
            Cart.getCart((resStatus, resMessage, resData) => {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            });
        }
    } catch (error) {
        console.error('Error getting cart controller:', error);
        next(error);
    }
};
const handleGetCartByUser = (req, res, next) => {
    try {
        Cart.getCartByUserId(req.params.id, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        console.error('Error getting cart controller:', error);
        next(error);
    }
};
const handleCreateCart = (req, res, next) => {
    try {
        Cart.createCart(req, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        console.error('Error creating cart controller:', error);
        next(error);
    }
};

const handleUpdateCart = (req, res, next) => {
    try {
        Cart.updateCart(req, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        console.error('Error updating cart controller:', error);
        next(error);
    }
};

const handleDeleteCart = (req, res, next) => {
    try {
        Cart.deleteCart(req.params.id, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        console.error('Error deleting cart controller:', error);
        next(error);
    }
};

module.exports = {
    handleGetCart,
    handleGetCartByUser,
    handleCreateCart,
    handleUpdateCart,
    handleDeleteCart,
};

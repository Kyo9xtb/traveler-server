const express = require('express');
const Router = express.Router();

const {
    handleGetCart,
    handleGetCartByUser,
    handleCreateCart,
    handleDeleteCart,
    handleUpdateCart,
} = require('../../controllers/cartController');

Router.route('/author/:id?')
    // [api/v1/tour]
    //[GET]
    .get(handleGetCartByUser);

Router.route('/:id?')
    // [api/v1/tour]
    //[GET]
    .get(handleGetCart)
    //[POST]
    .post(handleCreateCart)
    // [PUT]
    .put(handleUpdateCart)
    // [DELETE]
    .delete(handleDeleteCart);
module.exports = Router;

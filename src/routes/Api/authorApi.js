const express = require('express');
const { handleLogin, handleLogout, handleCheckLogin } = require('../../controllers/adminController');
const Router = express.Router();

Router.route('/login')
    //[POST]
    .post(handleLogin);

Router.route('/logout')
    //[POST]
    .post(handleLogout);

Router.route('/me')
    //[GET]
    .get(handleCheckLogin);
    // .get((req, res) => {
    //     console.log(req.cookies);
    //     res.json('ssl')
        
    // })
module.exports = Router;

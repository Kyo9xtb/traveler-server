const express = require('express');
const Router = express.Router();

const userApi = require('./userApi');
const productApi = require('./productApi');
const contactApi = require('./contactApi');
const newsApi = require('./newsApi');
const touristsApi = require('./touristplaceApi');
const tourApi = require('./tourApi');
const bookTourApi = require('./booktourApi');

Router.use('/book-tour', bookTourApi);
Router.use('/tour', tourApi);
Router.use('/tourist-place', touristsApi);
Router.use('/news', newsApi);
Router.use('/user', userApi);
Router.use('/contact', contactApi);
Router.use('/', productApi);

module.exports = Router;

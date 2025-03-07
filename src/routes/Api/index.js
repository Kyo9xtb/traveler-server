const express = require('express');
const Router = express.Router();

const userApi = require('./userApi');
const productApi = require('./productApi');
const contactApi = require('./contactApi');
const newsApi = require('./newsApi');
const touristsApi = require('./touristPlaceApi');
const tourApi = require('./tourApi');
const bookTourApi = require('./bookTourApi');
const imagesApi = require('./imagesApi');
const authorsApi = require('./adminApi');
const cartApi = require('./cartApi');
const statisticalReportApi = require('./statisticalReportApi');

Router.use('/book-tour', bookTourApi);
Router.use('/tour', tourApi);
Router.use('/tourist-place', touristsApi);
Router.use('/news', newsApi);
Router.use('/user', userApi);
Router.use('/contact', contactApi);
Router.use('/post-images', imagesApi);
Router.use('/author', authorsApi);
Router.use('/cart', cartApi);
Router.use('/statistical-report', statisticalReportApi);
Router.use('/', productApi);

module.exports = Router;

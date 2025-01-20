const express = require('express');
const Router = express.Router();

const {
    handleStatisticalTour,
    handleRevenueTour,
    handleStatisticalBookTour,
    handleCustomerStatistics,
    handleMonthlyStatistics,
    handleUserStatistics
} = require('../../controllers/statisticalReportController');
Router.route('/statistical-tour').get(handleStatisticalTour);
Router.route('/revenue-tour').get(handleRevenueTour);
Router.route('/statistical-book-tour').get(handleStatisticalBookTour);
Router.route('/customer-statistics').get(handleCustomerStatistics);
Router.route('/user-statistics').get(handleUserStatistics);
Router.route('/monthly-statistics').get(handleMonthlyStatistics);

module.exports = Router;

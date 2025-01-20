const StatisticalReport = require('../models/statisticalReportModel');

const handleStatisticalTour = async (req, res, next) => {
    try {
        StatisticalReport.statisticalTour((resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        console.error('Error getting statistical tour:', error);
        next(error);
    }
};
const handleRevenueTour = async (req, res, next) => {
    try {
        StatisticalReport.revenueTour((resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        console.error('Error getting revenue tour:', error);
        next(error);
    }
};
const handleStatisticalBookTour = async (req, res, next) => {
    try {
        StatisticalReport.statisticalBookTour((resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        console.error('Error getting statistical book tour:', error);
        next(error);
    }
};
const handleCustomerStatistics = async (req, res, next) => {
    try {
        StatisticalReport.customerStatistics((resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        console.error('Error getting customer statistical:', error);
        next(error);
    }
};

const handleUserStatistics = async (req, res, next) => {
    try {
        StatisticalReport.userStatistics((resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        console.error('Error getting customer statistical:', error);
        next(error);
    }
};

const handleMonthlyStatistics = async (req, res, next) => {
    try {
        StatisticalReport.monthlyStatistics((resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        console.error('Error getting customer statistical:', error);
        next(error);
    }
};
module.exports = {
    handleStatisticalTour,
    handleRevenueTour,
    handleStatisticalBookTour,
    handleCustomerStatistics,
    handleMonthlyStatistics,
    handleUserStatistics,
};

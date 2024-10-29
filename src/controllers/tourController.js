const Tour = require('../models/tourModel');

const handlerGetTour = (req, res, next) => {
    try {
        if (req.params.id) {
            Tour.getTourById(req.params.id, (resStatus, resMessage, resData) => {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            });
        } else {
            Tour.getAllTour((resStatus, resMessage, resData) => {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            });
        }
    } catch (error) {
        next(error);
    }
};

const handlerCreateTour = (req, res, next) => {
    try {
        Tour.createTour(req, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};

const handlerUpdateTour = (req, res, next) => {
    try {
        Tour.updateTour(req, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};

const handlerDeleteTour = (req, res, next) => {
    try {
        Tour.deleteTour(req.params.id, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handlerGetTour,
    handlerCreateTour,
    handlerUpdateTour,
    handlerDeleteTour,
};

const BookTour = require('../models/booktourModel');

const handlerGetBookTour = (req, res, next) => {
    try {
        if (req.params.id) {
            BookTour.getBookTourId(req.params.id, (resStatus, resMessage, resData) => {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            });
        } else {
            BookTour.getAllBookTour((resStatus, resMessage, resData) => {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            });
        }
    } catch (error) {
        next(error);
    }
};

const handlerCreateBookTour = (req, res, next) => {
    try {
        BookTour.createBookTour(req, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};

const handlerUpdateBookTour = (req, res, next) => {
    try {
        BookTour.updateBookTour(req, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};

const handlerDeleteBookTour = (req, res, next) => {
    try {
        BookTour.deleteBookTour(req.params.id, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handlerGetBookTour,
    handlerCreateBookTour,
    handlerUpdateBookTour,
    handlerDeleteBookTour,
};

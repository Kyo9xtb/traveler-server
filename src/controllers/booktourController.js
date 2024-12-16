const BookTour = require('../models/booktourModel');

const handleGetBookTour = (req, res, next) => {
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

const handleCreateBookTour = (req, res, next) => {
    try {
        BookTour.createBookTour(req, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};

const handleUpdateBookTour = (req, res, next) => {
    try {
        BookTour.updateBookTour(req, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};

const handleDeleteBookTour = (req, res, next) => {
    try {
        BookTour.deleteBookTour(req.params.id, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleGetBookTour,
    handleCreateBookTour,
    handleUpdateBookTour,
    handleDeleteBookTour,
};

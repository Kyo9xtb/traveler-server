const BookTour = require('../models/bookTourModel');

const handleGetBookTour = (req, res, next) => {
    try {
        if (req.params.id) {
            BookTour.getBookTourId(req.params.id, (resStatus, resMessage, resData) => {
                if (resData.code) {
                    res.status(500).json({ status: resStatus, message: resMessage });
                } else {
                    res.status(200).json({ status: resStatus, message: resMessage, result: resData });
                }
            });
        } else {
            BookTour.getAllBookTour((resStatus, resMessage, resData) => {
                if (resData.code) {
                    res.status(500).json({ status: resStatus, message: resMessage });
                } else {
                    res.status(200).json({ status: resStatus, message: resMessage, result: resData });
                }
            });
        }
    } catch (error) {
        console.error('Error getting book tour controller:', error);
        next(error);
    }
};

const handleCreateBookTour = (req, res, next) => {
    try {
        BookTour.createBookTour(req, (resStatus, resMessage, resData) => {
            console.log('resData', resData);

            if (resData && resData.code) {
                console.log('ádsad');

                res.status(500).json({ status: resStatus, message: resMessage });
            } else {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            }
        });
    } catch (error) {
        console.error('Error creating book tour controller:', error);
        next(error);
    }
};

const handleUpdateBookTour = (req, res, next) => {
    try {
        BookTour.updateBookTour(req, (resStatus, resMessage, resData) => {
            if (resData && resData.code) {
                res.status(500).json({ status: resStatus, message: resMessage });
            } else {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            }
        });
    } catch (error) {
        console.error('Error updating book tour controller:', error);
        next(error);
    }
};

const handleDeleteBookTour = (req, res, next) => {
    try {
        BookTour.deleteBookTour(req.params.id, (resStatus, resMessage, resData) => {
            if (resData && resData.code) {
                res.status(500).json({ status: resStatus, message: resMessage });
            } else {
                res.status(200).json({ status: resStatus, message: resMessage });
            }
        });
    } catch (error) {
        console.error('Error deleting book tour controller:', error);
        next(error);
    }
};

module.exports = {
    handleGetBookTour,
    handleCreateBookTour,
    handleUpdateBookTour,
    handleDeleteBookTour,
};

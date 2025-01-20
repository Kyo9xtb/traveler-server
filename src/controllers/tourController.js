const Tour = require('../models/tourModel');

const handlerGetTour = (req, res, next) => {
    try {
        if (!isNaN(Number(req.params.id))) {
            Tour.getTourById(req.params.id, (resStatus, resMessage, resData) => {
                if (resData && resData.code) {
                    res.status(500).json({ status: resStatus, message: resMessage });
                } else {
                    res.status(200).json({ status: resStatus, message: resMessage, result: resData });
                }
            });
        } else {
            Tour.getTour(req.params.id, (resStatus, resMessage, resData) => {
                if (resData && resData.code) {
                    res.status(500).json({ status: resStatus, message: resMessage });
                } else {
                    res.status(200).json({ status: resStatus, message: resMessage, result: resData });
                }
            });
        }
    } catch (error) {
        console.error('Error getting tour controller:', error);
        next(error);
    }
};

const handlerCreateTour = (req, res, next) => {
    try {
        Tour.createTour(req, (resStatus, resMessage, resData) => {
            if (resData && resData.code) {
                res.status(500).json({ status: resStatus, message: resMessage });
            } else {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            }
        });
    } catch (error) {
        console.error('Error creating tour controller:', error);

        next(error);
    }
};

const handlerUpdateTour = (req, res, next) => {
    try {
        Tour.updateTour(req, (resStatus, resMessage, resData) => {
            if (resData && resData.code) {
                res.status(500).json({ status: resStatus, message: resMessage });
            } else {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            }
        });
    } catch (error) {
        console.error('Error updating tour controller:', error);
        next(error);
    }
};

const handlerDeleteTour = (req, res, next) => {
    try {
        Tour.deleteTour(req.params.id, (resStatus, resMessage, resData) => {
            if (resData && resData.code) {
                res.status(500).json({ status: resStatus, message: resMessage });
            } else {
                res.status(200).json({ status: resStatus, message: resMessage });
            }
        });
    } catch (error) {
        console.error('Error deleting tour controller:', error);
        next(error);
    }
};

module.exports = {
    handlerGetTour,
    handlerCreateTour,
    handlerUpdateTour,
    handlerDeleteTour,
};

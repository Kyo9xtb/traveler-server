const TourPlace = require('../models/touristplaceModel');

const handlerGetTourPlace = async (req, res, next) => {
    try {
        if (req.params.id) {
            TourPlace.getById(req.params.id, (resStatus, resMessage, resData) => {
                res.status(200).json({
                    status: resStatus,
                    message: resMessage,
                    data: resData,
                });
            });
        } else {
            TourPlace.getAll((resStatus, resMessage, resData) => {
                res.status(200).json({
                    status: resStatus,
                    message: resMessage,
                    data: resData,
                });
            });
        }
    } catch (error) {
        next(error);
    }
};

const handlerCreateTourPlace = async (req, res, next) => {
    try {
        TourPlace.createTourPlace(req, (resStatus, resMessage, resData) => {
            res.status(200).json({
                status: resStatus,
                message: resMessage,
                data: resData,
            });
        });
    } catch (error) {
        next(error);
    }
};

const handlerUpdateTourPlace = async (req, res, next) => {
    try {
        TourPlace.updateTourPlace(req, (resStatus, resMessage, resData) => {
            res.status(200).json({
                status: resStatus,
                message: resMessage,
                result: resData,
            });
        });
    } catch (error) {
        next(error);
    }
};

const handlerDeleteTourPlace = async (req, res, next) => {
    try {
        TourPlace.deleteTourPlace(req.params.id, (resStatus, resMessage, resData) => {
            res.status(200).json({
                status: resStatus,
                message: resMessage,
                result: resData,
            });
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handlerGetTourPlace,
    handlerCreateTourPlace,
    handlerUpdateTourPlace,
    handlerDeleteTourPlace,
};

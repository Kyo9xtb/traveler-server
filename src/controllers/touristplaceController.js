const TourPlace = require('../models/touristPlaceModel');

const handlerGetTourPlace = async (req, res, next) => {
    try {
        TourPlace.getTouristPlace(req.params.id, (resStatus, resMessage, resData) => {
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

const handlerCreateTourPlace = async (req, res, next) => {
    try {
        TourPlace.createTourPlace(req, (resStatus, resMessage, resData) => {
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

const TourPlace = require('../models/touristPlaceModel');

const handlerGetTourPlace = async (req, res, next) => {
    try {
        if (!isNaN(Number(req.params.id))) {
            TourPlace.getTouristPlaceById(req.params.id, (resStatus, resMessage, resData) => {
                if (resData && resData.code) {
                    // res.status(500).json({ status: resStatus, message: resMessage });
                    res.status(500).json('A server side error occurred');
                } else {
                    // res.status(200).json({ status: resStatus, message: resMessage, result: resData });
                    resStatus ? res.status(200).json(resData) : res.status(200).json('Not Found');
                }
            });
        } else {
            TourPlace.getTouristPlace(req.params.id, (resStatus, resMessage, resData) => {
                if (resData && resData.code) {
                    // res.status(500).json({ status: resStatus, message: resMessage });
                    res.status(500).json('A server side error occurred');
                } else {
                    // res.status(200).json({ status: resStatus, message: resMessage, result: resData });
                    resStatus ? res.status(200).json(resData) : res.status(200).json('Not Found');
                }
            });
        }
    } catch (error) {
        console.error('Error getting tourist place controller:', error);
        next(error);
    }
};

const handlerCreateTourPlace = async (req, res, next) => {
    try {
        TourPlace.createTourPlace(req, (resStatus, resMessage, resData) => {
            if (resData && resData.code) {
                // res.status(500).json({ status: resStatus, message: resMessage });
                res.status(500).json('A server side error occurred');
            } else {
                // res.status(200).json({ status: resStatus, message: resMessage, result: resData });
                !resStatus
                    ? res.status(200).json('Not Found')
                    : TourPlace.getTouristPlace(resData, (resStatus, resMessage, resData) => {
                          res.status(200).json(resData);
                      });
            }
        });
    } catch (error) {
        console.error('Error creating tour place controller:', error);
        next(error);
    }
};

const handlerUpdateTourPlace = async (req, res, next) => {
    try {
        TourPlace.updateTourPlace(req, (resStatus, resMessage, resData) => {
            if (resData && resData.code) {
                // res.status(500).json({ status: resStatus, message: resMessage });
                res.status(500).json('A server side error occurred');
            } else {
                // res.status(200).json({ status: resStatus, message: resMessage, result: resData });
                !resStatus
                    ? res.status(200).json('Not Found')
                    : TourPlace.getTouristPlace(resData, (resStatus, resMessage, resData) => {
                          res.status(200).json(resData);
                      });
            }
        });
    } catch (error) {
        console.error('Error updating tour place controller:', error);
        next(error);
    }
};

const handlerDeleteTourPlace = async (req, res, next) => {
    try {
        TourPlace.deleteTourPlace(req.params.id, (resStatus, resMessage, resData) => {
            if (resData && resData.code) {
                // res.status(500).json({ status: resStatus, message: resMessage });
                res.status(500).json('A server side error occurred');
            } else {
                // res.status(200).json({ status: resStatus, message: resMessage });
                !resStatus ? res.status(200).json('Not Found') : res.status(200).json(resData);
            }
        });
    } catch (error) {
        console.error('Error deleting tour place controller:', error);
        next(error);
    }
};

module.exports = {
    handlerGetTourPlace,
    handlerCreateTourPlace,
    handlerUpdateTourPlace,
    handlerDeleteTourPlace,
};
